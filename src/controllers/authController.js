const router = require("express").Router();
const authService = require("../services/authService");
const authMiddleware = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const upload = require("../utils/helper");
const protectMiddleware = require("../middleware/protectMiddleware");

router.post(
  "/login",
  authMiddleware.validateLogin(),
  catchAsync(async (req, res, next) => {
    const { token, user } = await authService.staffLogin(req);
    response.success({
      res,
      message: "Login successful",
      data: { token, user },
    });
  })
);

router.post(
  "/forgot-password",
  authMiddleware.validateForgotPassword(),
  catchAsync(async (req, res, next) => {
    await authService.forgottenPassword(req);
    response.success({
      res,
      message: "Password reset OTP sent to your email, Please check your email",
    });
  })
);

router.post(
  "/verify-otp",
  authMiddleware.validateVerifyOTP(),
  catchAsync(async (req, res, next) => {
    const token = await authService.verifyOTP(req);
    response.success({
      res,
      message: "OTP verified successfully, Please enter your new password",
      data: { token },
    });
  })
);

router.post(
  "/change-password-with-otp",
  authMiddleware.validateChangePasswordOTP(),
  protectMiddleware.OTPprotect,
  catchAsync(async (req, res, next) => {
    await authService.changePasswordWithOTP(req);
    response.success({
      res,
      message:
        "Password changed successfully, Please login with your new password",
    });
  })
);

router.post(
  "/change-password",
  protectMiddleware.protect,
  authMiddleware.validateChangePassword(),
  catchAsync(async (req, res, next) => {
    await authService.changePassword(req);
    response.success({
      res,
      message: "Password changed successfully",
    });
  })
);

router.post(
  "/register",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("admin", "superadmin", "HR"),
  authMiddleware.validateRegister(),
  catchAsync(async (req, res, next) => {
    const staff = await authService.createStaff(req);
    const message = "Staff created successfully and details sent to email";
    response.success({ res, message, code: 201 });
  })
);

router.post(
  "/bulk-register",
  protectMiddleware.protect,
  protectMiddleware.restrictTo("admin", "superadmin", "HR"),
  upload.uploadFile,
  catchAsync(async (req, res, next) => {
    const created = await authService.bulkCreateUsers(req);
    const message = `${created.length} staff created successfully and details sent to email`;
    response.success({ res, message, code: 201 });
  })
);
router.post(
  "/create-vendor",
  authMiddleware.validateCreateVendor(),
  protectMiddleware.protect,
  protectMiddleware.restrictTo("admin", "superadmin", "HR"),
  catchAsync(async (req, res, next) => {
    const vendor = await authService.createVendor(req);
    response.success({
      res,
      message: "Vendor created successfully, details sent to email",
      code: 201,
    });
  })
);

module.exports = router;
