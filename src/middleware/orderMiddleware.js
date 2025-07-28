const { Joi, celebrate, Segments } = require("celebrate");

class OrderMiddleware {
  static validateCreateOrder() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        noOfVouchers: Joi.number()
          .integer()
          .min(1)
          .required()
          .label("noOfVouchers"),
      }),
    });
  }
}

module.exports = OrderMiddleware;
