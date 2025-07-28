const {
  Staff,
  Voucher,
  Order,
  Vendor,
  VoucherType,
} = require("../database/models");

exports.getAllUsers = async () => {
  try {
    const users = await Staff.findAll({
      attributes: [
        "staffId",
        "firstName",
        "email",
        "role",
        "voucherTypeId",
        "userId",
      ],
      where: { active: true },
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

exports.getAllVendors = async () => {
  const vendors = Vendor.findAll({});
  return vendors;
};

exports.deactivateVendor = async (req) => {
  //
};

exports.deactivateStaff = async (req) => {
  //
};

exports.gitfSpecialVoucher = async (req) => {
  const { staffId, number } = req.body;
  const voucherType = VoucherType.findOne({ where: { name: "special" } });
  const staff = Staff.findOne({ where: { staffId } });

  const voucher = Voucher.create({
    voucherTypeId: voucherType.voucherTypeId,
    userId: staff.userId,
    isPurchased: true,
    purchasedAt: new Date(),
  });
};
