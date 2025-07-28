const { Joi, celebrate, Segments } = require("celebrate");

class UserMiddleware {
  static validateGiftVoucher() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        purchasedVoucher: Joi.boolean().required().label("purchasedVoucher"),
        recipientEmail: Joi.string().email().required().label("recipientEmail"),
        numberOfVouchers: Joi.number()
          .integer()
          .min(1)
          .required()
          .label("numberOfVouchers"),
      }),
    });
  }
  static validatePurchaseVoucher() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        numberOfVouchers: Joi.number()
          .integer()
          .min(1)
          .required()
          .label("numberOfVouchers"),
      }),
    });
  }
}

module.exports = UserMiddleware;
