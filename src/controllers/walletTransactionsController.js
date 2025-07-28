const router = require("express").Router();
const walletTransactionsService = require("../services/walletTransactions");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const protectMiddleware = require("../middleware/protectMiddleware");

router.get(
  "/",
  protectMiddleware.protect,
  catchAsync(async (req, res, next) => {
    const transactions = await walletTransactionsService.getWalletTransactions(
      req
    );
    response.success({
      res,
      message: "Wallet transactions retrieved successfully",
      data: transactions,
    });
  })
);

module.exports = router;
