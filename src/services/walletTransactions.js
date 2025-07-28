const { WalletTransaction } = require("../database/models");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getWalletTransactions = async (req) => {
  const { userId } = req.user;

  const features = new APIFeatures({ ...req.query, userId })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const options = features.build();

  const transactions = await WalletTransaction.findAll(options);

  // if (!transactions || transactions.length === 0) {
  //   throw new AppError("No wallet transactions found", 404);
  // }

  return transactions;
};
