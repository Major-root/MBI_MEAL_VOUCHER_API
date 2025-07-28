const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

exports.hashInput = async (data) => {
  try {
    const hashed = await bcrypt.hash(data, 12);
    return hashed;
  } catch (error) {
    throw error;
  }
};

exports.verifyInput = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

exports.genOTPJWTtoken = (userId) => {
  return jwt.sign({ userId }, config.otpJwtSecret, {
    expiresIn: config.otpJwtExpiresIn,
  });
};

exports.generateOTPToken = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};
