const { Joi, celebrate, Segments } = require("celebrate");
const crypto = require("crypto");
const config = require("../utils/config");
const secret = config.paystackWebhookSecret;

class PaymentMiddleware {
  static validateInitializePayment() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        amount: Joi.number().required().min(1).label("amount"),
      }),
    });
  }

  static validateVerifyPayment() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        reference: Joi.string().required().label("reference"),
      }),
    });
  }

  static verifyWebhook() {
    return (req, res, next) => {
      const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (hash == req.headers["x-paystack-signature"]) {
        console.log("Webhook hash verified");
        return next();
      } else {
        throw new AppError("Invalid Signature", 403);
      }
    };
  }
}

module.exports = PaymentMiddleware;
