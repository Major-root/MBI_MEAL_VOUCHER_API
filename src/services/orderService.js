const { Order, Voucher, VoucherType } = require("../database/models");
const AppError = require("../utils/appError");
const { Op } = require("sequelize");
const path = require("path");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ123456789", 7);
const config = require("../utils/config");
const fs = require("fs");
const QRCode = require("qrcode");
const sharp = require("sharp");

const orderCodeService = async (req) => {
  const user = req.user;
  let prefix = "MB";
  if (user?.firstName && user?.lastName) {
    prefix = user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
  }

  let code;
  let unique = false;
  let attempts = 0;

  while (!unique && attempts < 5) {
    code = `${prefix}-${nanoid()}`;
    const exists = await Order.findOne({
      where: { orderCode: code },
    });
    if (!exists) {
      unique = true;
    }
    attempts++;
  }

  if (!unique) {
    throw new AppError("Unable to create Order, Please try again.", 500);
  }

  return { code };
};

const generateQRCodeWithLogo = async ({ url, fileName }) => {
  try {
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: "H",
      type: "png",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const logoPath = path.join(__dirname, "../public/logo.jpg");
    const outputPath = path.join(
      __dirname,
      "../public/qrcodes",
      `${fileName}.png`
    );

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    const qrWithLogo = await sharp(qrBuffer)
      .composite([
        {
          input: await sharp(logoPath).resize(80, 80).toBuffer(),
          gravity: "centre",
        },
      ])
      .toFile(outputPath);

    return `public/qrcodes/${fileName}.png`;
  } catch (err) {
    console.error("QR Code generation failed:", err);
    throw new AppError("QR Code generation failed", 500);
  }
};

exports.createOrder = async (req) => {
  const { code } = await orderCodeService(req);
  const url = `${config.qrcodeUrlDev}${code}`;
  const qrCodePath = await generateQRCodeWithLogo({
    url,
    fileName: Date.now(),
  });
  const { userId } = req.user;
  const { noOfVouchers } = req.body;
  const vouchers = await Voucher.findAll({
    where: {
      status: "active",
      isPurchased: true,
      [Op.or]: [
        {
          userId,
          transferred: false,
        },
        {
          transferredTo: userId,
        },
      ],
    },
    order: [["issuedAt", "ASC"]],
    limit: noOfVouchers,
    include: [
      {
        model: VoucherType,
        as: "voucherType",
        attributes: ["name", "voucherCost", "voucherWorth"],
      },
    ],
  });
  console.log("Vouchers found:", vouchers.length);
  if (vouchers.length < noOfVouchers) {
    throw new AppError(
      "Not enough vouchers available for purchase, Please check how many active voucher you have",
      400
    );
  }

  const worth = vouchers.reduce(
    (sum, voucher) => sum + voucher.voucherType.voucherWorth,
    0
  );
  const order = await Order.create(
    {
      userId,
      noOfVouchers,
      orderValue: worth,
      orderStatus: "pending",
      belongsTo: "staff",
      orderQrcode: qrCodePath,
      orderCode: code,
    },
    { userContext: req.user }
  );

  console.log("Order created:", order);
  await Promise.all(
    vouchers.map((voucher) => {
      console.log(voucher);
      voucher.update({
        orderId: order.orderId,
        status: "pending",
      });
    })
  );

  return order.orderCode;
};

exports.redeemOrder = async (req) => {
  const { userId } = req.user;
  console.log("Here is the userId", userId);
  const { code } = req.body || req.params;

  const order = await Order.findOne({
    where: { orderCode: code, orderStatus: "pending" },
  });
  if (!order) {
    throw new AppError(
      "Invalid Order code, Please provide a vilid order code",
      400
    );
  }
  console.log("order:", order);
  console.log("OrderId ", order.orderId);
  await order.update({ vendorId: userId, orderStatus: "completed" });

  const vouchers = await Voucher.findAll({
    where: { orderId: order.orderId, status: "pending" },
  });

  if (!vouchers) {
    throw new AppError("No voucher is associated with your code", 400);
  }
  await Promise.all(
    vouchers.map((voucher) => {
      voucher.update({
        vendorId: userId,
        status: "redeemed",
        redeemedAt: new Date(),
      });
    })
  );
  return order.orderValue;
};
