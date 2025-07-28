const { celebrate, Joi, Segments } = require("celebrate");

class AuthMiddleware {
  static validateLogin() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        identifier: Joi.string().required().label("identifier"),
        password: Joi.string().min(6).required().label("password"),
      }),
    });
  }

  static validateRegister() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        firstName: Joi.string().required().label("firstName"),
        lastName: Joi.string().required().label("lastName"),
        email: Joi.string().email().required().label("email"),
        staffId: Joi.number().required().label("staffId"),
        voucherType: Joi.string().required().label("voucherType"),
      }),
    });
  }
  static validateChangePassword() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        currentPassword: Joi.string()
          .min(6)
          .required()
          .label("currentPassword"),
        newPassword: Joi.string().min(6).required().label("newPassword"),
      }),
    });
  }

  static validateCreateVendor() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        vendorId: Joi.number().required().label("vendorId"),
        name: Joi.string().required().label("name"),
        email: Joi.string().email().required().label("email"),
        phone: Joi.string().required().label("phone"),
      }),
    });
  }

  static validateForgotPassword() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required().label("email"),
      }),
    });
  }

  static validateVerifyOTP() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required().label("email"),
        OTP: Joi.string().length(6).required().label("OTP"),
      }),
    });
  }

  static validateChangePasswordOTP() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        newPassword: Joi.string()
          .min(6)
          .required()
          .label("newPassword")
          .error(new Error("New password must be at least 6 characters long.")),
      }),
    });
  }
}

module.exports = AuthMiddleware;
