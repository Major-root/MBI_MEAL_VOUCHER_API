const router = require("express").Router();
const voucherTypeService = require("../services/voucherTypeService");
const voucherTypeMiddleware = require("../middleware/voucherTypeMiddleware");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const success = require("../utils/response");
const protectMiddleware = require("../middleware/protectMiddleware");

router.post(
  "/create",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("accountant"),
  voucherTypeMiddleware.validateCreateVoucherType(),
  catchAsync(async (req, res, next) => {
    const voucherType = await voucherTypeService.createVoucherType(req);
    success.success({
      res,
      message: "Voucher type created successfully",
      data: voucherType,
      code: 201,
    });
  })
);
router.get(
  "/all",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("accountant"),
  catchAsync(async (req, res, next) => {
    const voucherTypes = await voucherTypeService.getAllVoucherTypes();
    success.success({
      res,
      message: "All voucher types retrieved successfully",
      data: voucherTypes,
    });
  })
);

router.patch(
  "/update/:name",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("accountant"),
  voucherTypeMiddleware.validateUpdateVoucherType(),
  catchAsync(async (req, res, next) => {
    const updatedVoucherType = await voucherTypeService.updateVoucherType(req);
    success.success({
      res,
      message: "Voucher type updated successfully",
      data: updatedVoucherType,
    });
  })
);

module.exports = router;
