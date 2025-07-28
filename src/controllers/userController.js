const router = require("express").Router();
const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const protectMiddleware = require("../middleware/protectMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

router.get(
  "/get-number-of-voucher-available-for-purchase",
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const count = await userService.getNumberOfVoucherAvailabeForPurchase(req);
    return response.success({
      res,
      message:
        "Number of vouchers available for purchase retrieved successfully",
      data: { count },
    });
  })
);

router.get(
  "/get-number-of-unused-purchased-vouchers",
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const count = await userService.getNumberOfUnusedPurchasedVouchers(req);
    return response.success({
      res,
      message: "Number of unused purchased vouchers retrieved successfully",
      data: { count },
    });
  })
);

router.post(
  "/gift-voucher",
  userMiddleware.validateGiftVoucher(),
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const result = await userService.giftVoucher(req);
    return response.success({
      res,
      message: "Voucher gifted successfully",
      data: result,
    });
  })
);

router.get(
  "/get-vouchers-for-immediate-purchase",
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const { voucherNumber, totalCost } =
      await userService.getVouchersForImmediatePurchase(req);
    return response.success({
      res,
      message: "Vouchers for immediate purchase retrieved successfully",
      data: { voucherNumber, totalCost },
    });
  })
);

router.post(
  "/purchase-voucher",
  userMiddleware.validatePurchaseVoucher(),
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const result = await userService.purchaseVouchers(req);
    return response.success({
      res,
      message: "Voucher purchased successfully",
      data: result,
    });
  })
);

router.get(
  "/get-active-orders",
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const orders = await userService.getActiveOrders(req);
    response.success({
      res,
      message: "Orders retrieved successfully",
      data: orders,
    });
  })
);

router.patch(
  "/cancel-order/:orderId",
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    await userService.cancelOrder(req);
    response.success({
      res,
      message: "Order cancelled successfully",
    });
  })
);

module.exports = router;
