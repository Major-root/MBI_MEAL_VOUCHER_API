const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",

  dev_db_username: process.env.DEVELOPMENT_DB_USERNAME,
  dev_db_password: process.env.DEVELOPMENT_DB_PASSWORD,
  dev_db_database: process.env.DEVELOPMENT_DB_NAME,
  dev_db_host: process.env.DEVELOPMENT_DB_HOST,
  dev_db_dialect: "postgres",
  dev_db_port: process.env.DEVELOPMENT_DB_PORT,

  prod_db_username: process.env.PRODUCTION_DB_USERNAME,
  prod_db_password: process.env.PRODUCTION_DB_PASSWORD,
  prod_db_database: process.env.PRODUCTION_DB_NAME,
  prod_db_host: process.env.PRODUCTION_DB_HOST,
  prod_db_dialect: "postgres",
  prod_db_port: process.env.PRODUCTION_DB_PORT,

  emailFrom: process.env.EMAIL_FROM,
  googleUsername: process.env.GOOGLE_USERNAME,
  googlePassword: process.env.GOOGLE_PASSWORD,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  otpJwtSecret: process.env.OTP_JWT_SECRET,
  otpJwtExpiresIn: process.env.OTP_JWT_EXPIRES_IN || "10m",

  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
  paystackInitializeUrl: "https://api.paystack.co/transaction/initialize",
  paystackVerifyUrl: "https://api.paystack.co/transaction/verify/",

  qrcodeUrlDev:
    process.env.QRCODE_URL_DEV || "http://localhost:8080/api/v1/orders/verify/",
};
