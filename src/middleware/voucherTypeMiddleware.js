const { celebrate, Joi, Segments } = require("celebrate");

class VoucherTypeMiddleware {
  static validateCreateVoucherType() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        voucherCost: Joi.number().required(),
        voucherWorth: Joi.number().required(),
      }),
    });
  }

  //   static validateGetAllVoucherTypes() {
  //     return celebrate({
  //       [Segments.QUERY]: Joi.object().keys({
  //         page: Joi.number().optional(),
  //         limit: Joi.number().optional(),
  //       }),
  //     });
  //   }

  static validateUpdateVoucherType() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        name: Joi.string().required(),
      }),
      [Segments.BODY]: Joi.object().keys({
        voucherCost: Joi.number().optional(),
        voucherWorth: Joi.number().optional(),
      }),
    });
  }
}

module.exports = VoucherTypeMiddleware;
