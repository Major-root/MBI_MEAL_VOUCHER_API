const { Staff, VoucherType, Sequelize, Vendor } = require("../database/models");
const encrypt = require("../utils/encryption");
const AppError = require("../utils/appError");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const path = require("path");
const streamifier = require("streamifier");
const Email = require("../utils/email");
// const { sendAccountEmail } = require("../utils/email");

exports.createStaff = async (req) => {
  const voucherType = "regular" || req.body.voucherType;
  const type = await VoucherType.findOne({
    where: { name: voucherType },
  });
  if (!type) {
    throw new AppError("Please provide a valid voucher type", 404);
  }

  const genPword = `${req.body.firstName}${req.body.staffId}`;
  const password = await encrypt.hashInput(genPword);
  const staffData = {
    staffId: req.body.staffId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password,
    voucherTypeId: type.voucherTypeId,
  };

  const staff = await Staff.create(staffData);

  await new Email(
    { email: staffData.email, firstName: staffData.firstName },
    { password: genPword, staffId: staffData.staffId, email: staffData.email }
  ).sendAccountEmail();

  return staff;
};

exports.staffLogin = async (req) => {
  const { identifier, password } = req.body;
  let staff = await Staff.findOne({
    where: {
      [Sequelize.Op.or]: [
        { email: identifier },
        { staffId: Number(identifier) || 0 },
      ],
    },
  });

  if (!staff) {
    staff = await Vendor.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: identifier },
          { vendorId: Number(identifier) || 0 },
        ],
      },
    });
    if (!staff) {
      throw new AppError(
        "Please provide a valid email or staffid and password",
        401
      );
    }
  }

  const isPasswordValid = await encrypt.verifyInput(password, staff.password);
  if (!isPasswordValid) {
    throw new AppError(
      "Please provide a valid email or staffid and password",
      401
    );
  }
  if (!staff.active) {
    throw new AppError(
      "You are not allowed to login, Please contact the admin",
      403
    );
  }
  const token = encrypt.generateToken(staff.userId);
  return {
    token,
    user: {
      userId: staff.userId,
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role,
      balance: staff.balance,
    },
  };
};

exports.bulkCreateUsers = async (req) => {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded. Please upload a file", 400);
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const users = [];

    if (ext === ".csv") {
      await new Promise((resolve, reject) => {
        streamifier
          .createReadStream(req.file.buffer)
          .pipe(csv())
          .on("data", (data) => users.push(data))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (ext === ".xlsx") {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      users.push(...jsonData);
    } else {
      throw new AppError(
        "Unsupported file format. Only CSV and Excel files are allowed.",
        400
      );
    }

    const created = [];

    for (const user of users) {
      const { firstName, lastName, email, staffId, voucherType } = user;

      if (!firstName || !lastName || !email || !staffId || !voucherType)
        continue;
      const existing = await Staff.findOne({
        where: { [Sequelize.Op.or]: [{ email }, { staffId }] },
      });
      if (existing) continue;

      const password = `${firstName}${staffId}`;
      const hashedPassword = await encrypt.hashInput(password);

      const type = await VoucherType.findOne({
        where: { name: "regular" || voucherType },
      });
      if (!type) {
        throw new AppError(
          `Please provide a valid voucher type for ${firstName}, with staffId; ${staffId}`,
          404
        );
      }

      await Staff.create({
        firstName,
        lastName,
        email,
        staffId,
        password: hashedPassword,
        voucherTypeId: type.voucherTypeId,
      });

      await new Email(
        { email, firstName },
        { password, staffId, email }
      ).sendAccountEmail();

      created.push(email);
    }

    return created;
  } catch (err) {
    console.error(err);
    throw new AppError(
      "An error occurred while processing the file. Dey careful mate",
      500
    );
  }
};

exports.changePassword = async (req) => {
  const { currentPassword, newPassword } = req.body;
  const staff = await Staff.findByPk(req.user.userId);
  if (!staff) {
    staff = await Vendor.findByPk(req.user.userId);
    if (!staff) {
      throw new AppError("User not found", 404);
    }
  }

  const isCurrentPasswordValid = await encrypt.verifyInput(
    currentPassword,
    staff.password
  );

  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Current password is incorrect, Please provide the correct password",
      401
    );
  }

  const hashedNewPassword = await encrypt.hashInput(newPassword);
  staff.password = hashedNewPassword;
  await staff.save();

  return { message: "Password changed successfully" };
};

exports.forgottenPassword = async (req) => {
  const { email } = req.body;
  let staff = await Staff.findOne({ where: { email } });

  if (!staff) {
    staff = await Vendor.findOne({ where: { email } });
    if (!staff) {
      throw new AppError(
        "No user found with this email address, Please provide a valid email address",
        401
      );
    }
  }

  const OTP = encrypt.generateOTPToken();
  staff.OTPExpiresAt = Date.now() + 10 * 60 * 1000;
  staff.OTP = OTP;
  await staff.save();

  await new Email(
    { email: staff.email, firstName: staff.firstName || staff.name },
    OTP
  ).sendOTPEmail();

  return { message: "OTP sent to your email address" };
};

exports.verifyOTP = async (req) => {
  const { email, OTP } = req.body;
  let staff = await Staff.findOne({ where: { email } });

  if (!staff) {
    staff = await Vendor.findOne({ where: { email } });
    if (!staff) {
      throw new AppError(
        "No user found with this email address, Please provide a valid email address",
        401
      );
    }
  }
  if (
    staff.OTP !== OTP ||
    Date.now() > new Date(staff.OTPExpiresAt).getTime()
  ) {
    throw new AppError("Invalid or expired OTP", 401);
  }
  staff.OTP = null;
  staff.OTPExpiresAt = null;
  await staff.save();

  token = encrypt.genOTPJWTtoken(staff.userId);

  return token;
};

exports.changePasswordWithOTP = async (req) => {
  const { newPassword } = req.body;
  const userId = req.OTPuser.userId;

  let staff = await Staff.findByPk(userId);
  if (!staff) {
    staff = await Vendor.findByPk(userId);
    if (!staff) {
      throw new AppError("User not found", 404);
    }
  }
  const hashedNewPassword = await encrypt.hashInput(newPassword);
  staff.password = hashedNewPassword;
  await staff.save();
};

// VENDORS AUTHENTICATION

exports.createVendor = async (req) => {
  const firstName = req.body.name.split(" ")[0];
  const genPword = `${firstName}${req.body.vendorId}`;
  const password = await encrypt.hashInput(genPword);
  const vendorData = {
    vendorId: req.body.vendorId,
    name: req.body.name,
    email: req.body.email,
    password,
    phone: req.body.phone,
  };

  const vendor = await Vendor.create(vendorData);

  await new Email(
    { email: vendorData.email, firstName: vendorData.name },
    {
      password: genPword,
      vendorId: vendorData.vendorId,
      email: vendorData.email,
    }
  ).sendAccountEmail();

  return vendor;
};
