const router = require("express").Router();
const orderMiddleware = require("../middleware/orderMiddleware");
const orderService = require("../services/orderService");
const catchAsync = require("../utils/catchAsync");
const protectMiddleware = require("../middleware/protectMiddleware");
const response = require("../utils/response");

router.post(
  "/create",
  protectMiddleware.protect,
  orderMiddleware.validateCreateOrder(),
  catchAsync(async (req, res) => {
    const orderCode = await orderService.createOrder(req);
    response.success({
      res,
      statusCode: 201,
      message:
        "Order created successfully, Proceed to the Eatery to Buy your food",
      data: { orderCode },
    });
  })
);

router.patch(
  "/verify",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("vendor"),
  catchAsync(async (req, res) => {
    const orderValue = await orderService.redeemOrder(req);
    response.success({
      res,
      message: `Order successfully redeemed`,
      data: orderValue,
    });
  })
);

router.patch(
  "/verify/:code",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("vendor"),
  catchAsync(async (req, res) => {
    const orderValue = await orderService.redeemOrder(req);
    response.success({
      res,
      message: `Order successfully redeemed`,
      data: orderValue,
    });
  })
);

module.exports = router;
