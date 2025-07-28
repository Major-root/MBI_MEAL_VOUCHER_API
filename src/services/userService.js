const {
  Staff,
  Voucher,
  VoucherType,
  WalletTransaction,
  Order,
} = require("../database/models");
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

// correct the typo of "transfared" to "transferred"

exports.getNumberOfVoucherAvailabeForPurchase = async (req) => {
  const { userId } = req.user;

  const count = await Voucher.count({
    where: {
      status: "active",
      isPurchased: false,
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
  });

  return count;
};

exports.getNumberOfUnusedPurchasedVouchers = async (req) => {
  const { userId } = req.user;
  const count = await Voucher.count({
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
  });
  return count;
};

// exports.getNumberOfUnusedPurchasedVouchers = async (req) => {
//   const { userId } = req.user;
//   const count = await Voucher.count({
//     where: {
//       [Op.and]: [
//         { status: "active" },
//         { isPurchased: true },
//         {
//           [Op.or]: [{ userId }, { transferedTo: userId }],
//         },
//       ],
//     },
//   });
//   return count;
// };

exports.giftVoucher = async (req) => {
  const { userId } = req.user;
  const { purchasedVoucher, recipientEmail, numberOfVouchers } = req.body;

  if (!numberOfVouchers || isNaN(numberOfVouchers) || numberOfVouchers <= 0) {
    throw new AppError("Invalid number of vouchers to gift.", 400);
  }

  const recipient = await Staff.findOne({
    where: { email: recipientEmail, active: true },
  });

  if (!recipient) {
    throw new AppError("Recipient not found or inactive.", 400);
  }
  if (recipient.userId === userId) {
    throw new AppError("You cannot gift a voucher to yourself MF.", 400);
  }

  const isPurchased = !!purchasedVoucher;

  const availableCount = isPurchased
    ? await exports.getNumberOfUnusedPurchasedVouchers(req)
    : await exports.getNumberOfVoucherAvailabeForPurchase(req);

  if (availableCount < numberOfVouchers) {
    throw new AppError(
      `You do not have enough ${
        isPurchased ? "purchased" : "available for purchase"
      } vouchers to gift. You have ${availableCount} available.`,
      400
    );
  }

  const vouchers = await Voucher.findAll({
    where: {
      status: "active",
      isPurchased,
      transferred: false,
      [Op.or]: [{ userId }, { transferredTo: userId }],
    },
    limit: numberOfVouchers,
    order: [["issuedAt", "ASC"]],
  });

  if (vouchers.length < numberOfVouchers) {
    throw new AppError("Failed to locate enough vouchers to gift.", 400);
  }

  for (const voucher of vouchers) {
    await voucher.update({
      transferredTo: recipient.userId,
      transferred: true,
    });
  }

  await new Email(
    { email: recipient.email, firstName: recipient.firstName },
    {
      numberOfVouchers,
      isPurchased,
      from: req.user.firstName,
    }
  ).giftVoucherEmail();

  return {
    message: `${numberOfVouchers} voucher(s) successfully gifted to ${recipient.firstName}.`,
  };
};

exports.getVouchersForImmediatePurchase = async (req) => {
  const { userId } = req.user;

  const vouchers = await Voucher.findAll({
    where: {
      status: "active",
      isPurchased: false,
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
    include: [
      {
        model: VoucherType,
        as: "voucherType",
        attributes: ["name", "voucherCost", "voucherWorth"],
      },
    ],
  });
  const voucherNumber = vouchers.length;
  const totalCost = vouchers.reduce(
    (sum, voucher) => sum + voucher.voucherType.voucherCost,
    0
  );

  return { voucherNumber, totalCost };
};

exports.purchaseVouchers = async (req) => {
  const { userId } = req.user;
  const { numberOfVouchers } = req.body;
  const vouchers = await Voucher.findAll({
    where: {
      status: "active",
      isPurchased: false,
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
    include: [
      {
        model: VoucherType,
        as: "voucherType",
        attributes: ["name", "voucherCost", "voucherWorth"],
      },
    ],
  });

  if (vouchers.length < numberOfVouchers) {
    throw new AppError("Not enough vouchers available for purchase.", 400);
  }
  const totalCost = vouchers
    .slice(0, numberOfVouchers)
    .reduce((sum, voucher) => sum + voucher.voucherType.voucherCost, 0);
  if (totalCost > req.user.balance) {
    throw new AppError(
      "Insufficient balance to purchase vouchers. Please top up your account.",
      400
    );
  }
  for (let i = 0; i < numberOfVouchers; i++) {
    const voucher = vouchers[i];
    await voucher.update({
      isPurchased: true,
      purchasedAt: new Date(),
    });
  }
  await req.user.update({
    balance: req.user.balance - totalCost,
  });
  await WalletTransaction.create({
    userId,
    amount: totalCost,
    transactionType: "debit",
    description: `Purchased ${numberOfVouchers} voucher(s)`,
  });
  return {
    message: `${numberOfVouchers} voucher(s) purchased successfully. and ${totalCost} has been deducted from your balance.`,
  };
};

exports.getActiveOrders = async (req) => {
  const { userId } = req.user;

  const orders = await Order.findAll({
    where: { userId, orderStatus: "pending" },
  });
  return orders;
};

exports.cancelOrder = async (req) => {
  const { userId } = req.user;
  const { orderId } = req.params;

  const order = await Order.findOne({
    where: { userId, orderId, belongsTo: "staff", orderStatus: "pending" },
  });
  if (!order) {
    throw new AppError("No active order found", 400);
  }
  await order.update({ orderStatus: "cancelled" });

  const vouchers = await Voucher.findAll({
    where: {
      orderId,
      status: "pending",
      [Op.or]: [
        {
          userId,
          transferred: false,
        },
        {
          transferredTo: userId,
          transferred: true,
        },
      ],
    },
  });
  await Promise.all(
    vouchers.map((voucher) => {
      voucher.update({ orderId: null, status: "active" });
    })
  );
};
