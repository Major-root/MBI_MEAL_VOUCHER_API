const { VoucherType } = require("../database/models");
const AppError = require("../utils/appError");

exports.createVoucherType = async (req) => {
  const voucherTypeData = {
    name: req.body.name,
    voucherCost: req.body.voucherCost,
    voucherWorth: req.body.voucherWorth,
  };
  const voucherType = await VoucherType.create(voucherTypeData);
  return voucherType;
};

exports.getAllVoucherTypes = async () => {
  const voucherTypes = await VoucherType.findAll();
  return voucherTypes;
};

exports.updateVoucherType = async (req) => {
  const voucherType = req.params.name;
  const updatedData = {
    voucherCost: req.body.voucherCost,
    voucherWorth: req.body.voucherWorth,
  };
  const [updatedRowsCount, updatedRows] = await VoucherType.update(
    updatedData,
    {
      where: { name: voucherType },
      returning: true,
    }
  );
  if (updatedRowsCount === 0) {
    throw new AppError("Voucher type not found or no changes made", 400);
  }
  return updatedRows[0];
};
