const router = require("express").Router();
const paymentService = require("../services/paymentService");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const protectMiddleware = require("../middleware/protectMiddleware");
const paymentMiddleware = require("../middleware/paymentMiddleware");

router.post(
  "/initialize-payment",
  paymentMiddleware.validateInitializePayment(),
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    const { reference, authorization_url } =
      await paymentService.initializePayment(req);
    return response.success({
      res,
      message:
        "Payment initialized successfully, Please proceed to make payment",
      data: { reference, authorization_url },
    });
  })
);

router.get(
  "/verify-payment/:reference",
  paymentMiddleware.validateVerifyPayment(),
  protectMiddleware.protect,
  catchAsync(async (req, res) => {
    await paymentService.verifyPayment(req);
    return response.success({
      res,
      message: "Payment verified successfully",
    });
  })
);
router.post(
  "/webhook",
  paymentMiddleware.verifyWebhook(),
  catchAsync(async (req, res) => {
    await paymentService.verifyPayment(req);
    response.success(res, "Webhook received successfully");
  })
);

module.exports = router;
