const router = require("express").Router();
const vendorService = require("../services/vendorSerice");
const response = require("../utils/response");
const catchAsync = require("../utils/catchAsync");
const protectMiddleware = require("../middleware/protectMiddleware");

router.get(
  "/get-redeemed-vouchers",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("vendor"),
  catchAsync(async (req, res, next) => {
    const result = await vendorService.getNumberOfRedeemedVouchers(req);
    response.success({
      res,
      message: "Redeemed vouchers retrieved successfully",
      data: result,
    });
  })
);

module.exports = router;
