const { Joi, celebrate, Segments } = require("celebrate");

class HolidayMiddleware {
  static validateCreateHoliday() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        date: Joi.date().required().label("date"),
        title: Joi.string().required().label("title"),
      }),
    });
  }
}

module.exports = HolidayMiddleware;
