const { Payment, WalletTransaction, Staff } = require("../database/models");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const helper = require("../utils/helper");
const axios = require("axios");
const { verifyPayment, initializePayment } = require("../utils/payment")(axios);

exports.initializePayment = async (req) => {
  const { amount } = req.body;

  const response = await initializePayment({
    amount: amount * 100,
    email: req.user.email,
    callback_url: `${req.protocol}://${req.get("host")}/callback`,
    meta_data: {
      cancel_action: `${req.protocol}://${req.get("host")}/cancel-payment`,
    },
  });

  const { reference, authorization_url, access_code } = response.data.data;
  await Payment.create({
    amount,
    // currency: "NGN",
    status: "Pending",
    referenceId: reference,
    paymentService: "Paystack",
    userId: req.user.userId,
  });

  return { reference, authorization_url, access_code };
};

exports.verifyPayment = async (req) => {
  const reference = req.params?.reference || req.body?.data?.reference;
  const response = await verifyPayment(reference);

  if (!response.data.status) {
    await Payment.update(
      { status: "Failed" },
      { where: { referenceId: reference } }
    );
    throw new AppError("Payment verification failed", 400);
  }

  const amount = Number(response.data.data.amount) / 100;

  const [updatedCount, [payment]] = await Payment.update(
    {
      status: "Completed",
      amount,
    },
    {
      where: {
        referenceId: reference,
        status: "Pending",
      },
      returning: true,
    }
  );

  if (updatedCount === 0 || !payment) {
    throw new AppError("Payment already verified or not found", 400);
  }

  await Staff.increment("balance", {
    by: amount,
    where: { userId: req.user.userId },
  });

  await WalletTransaction.create({
    userId: req.user.userId,
    transactionType: "credit",
    amount,
    description: "Wallet funding",
  });

  return { status: true, message: "Payment verified and wallet funded" };
};
