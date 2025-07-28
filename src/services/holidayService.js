const { Holiday } = require("../database/models");

exports.createHoliday = async (req) => {
  const { date, title } = req.body;
  const staffId = req.user.staffId;

  const newHoliday = await Holiday.create({
    date,
    title,
    staffId,
  });
  return newHoliday;
};

exports.removeHoliday = async (req) => {
  const { holidayId } = req.params;
  const holiday = await Holiday.findByPk(holidayId);
  if (!holiday) {
    throw new Error("Holiday not found, Provide a valid holidayId");
  }
  await holiday.destroy();
  return holiday;
};

exports.getAllHolidays = async () => {
  const holidays = await Holiday.findAll({
    order: [["date", "ASC"]],
  });
  return holidays;
};
