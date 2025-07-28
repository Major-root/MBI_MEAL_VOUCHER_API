const router = require("express").Router();
const voucherService = require("../services/voucherService");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/weekly",
  catchAsync(async (req, res) => {
    const result = await voucherService.createWeeklyVouchers();
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  })
);

router.get(
  "/invalidate",
  catchAsync(async (req, res) => {
    const result = await voucherService.invalidateVoucher(req);
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  })
);

module.exports = router;
