const router = require("express").Router();
const holidayService = require("../services/holidayService");
const holidayMiddleware = require("../middleware/holidayMiddleware");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/create",
  holidayMiddleware.validateCreateHoliday(),
  catchAsync(async (req, res, next) => {
    const newHoliday = await holidayService.createHoliday(req);
    res.status(200).json({
      status: "success",
      message: "Holiday created successfully",
      code: 201,
    });
  })
);

router.delete(
  "/delete/:holidayId",
  catchAsync(async (req, res, next) => {
    const deletedHoliday = await holidayService.removeHoliday(req);
    res.status(200).json({
      status: "success",
      message: "Holiday deleted successfully",
      code: 200,
    });
  })
);
// get all holidays and run pagination
// Note: Pagination logic is not implemented in this example, but can be added as needed.

router.get(
  "/all",
  catchAsync(async (req, res, next) => {
    const holidays = await holidayService.getAllHolidays();
    res.status(200).json({
      status: "success",
      message: "Holidays retrieved successfully",
      code: 200,
      data: holidays,
    });
  })
);

module.exports = router;
