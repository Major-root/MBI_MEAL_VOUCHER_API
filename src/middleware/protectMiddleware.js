const jwt = require("jsonwebtoken");
const { Staff, Vendor } = require("../database/models");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const config = require("../utils/config");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, config.jwtSecret);
  const userId = decoded.id;

  let currentUser = await Staff.findOne({ where: { userId } });
  if (!currentUser) {
    currentUser = await Vendor.findOne({ where: { userId } });
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token does not exist.", 401)
      );
    }
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   );
  // }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action, Please follow the guidelines mate",
          403
        )
      );
    }
    next();
  };
};

exports.OTPprotect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You don't have the access to change password.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, config.otpJwtSecret);
  const userId = decoded.userId;

  let currentUser = await Staff.findOne({ where: { userId } });
  if (!currentUser) {
    currentUser = await Vendor.findOne({ where: { userId } });
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token does not exist.", 401)
      );
    }
  }

  req.OTPuser = currentUser;
  console.log("Current User in OTP protect:", currentUser);
  next();
});
