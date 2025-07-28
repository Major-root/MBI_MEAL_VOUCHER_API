const router = require("express").Router();
const accService = require("../services/accountService");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const protectMiddleware = require("../middleware/protectMiddleware");

router.get(
  "/transaction-summary",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("accountant"),
  catchAsync(async (req, res, next) => {
    const result = await accService.getTransactionsSummary(req);
    response.success({
      res,
      message: "Transaction summary",
      data: result,
    });
  })
);

router.get(
  "/redeemed-vouchers",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("accountant"),
  catchAsync(async (req, res, next) => {
    const result = await accService.getNumberOfRedeemedVouchers(req);
    response.success({
      res,
      message: "Redeemed vouchers returned successfully",
      data: result,
    });
  })
);

router.get(
  "/voucher-purchase-details",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("accountant"),
  catchAsync(async (req, res, next) => {
    const result = await accService.voucherPurchaseDetails(req);
    response.success({
      res,
      message: "successful",
      data: result,
    });
  })
);

module.exports = router;
