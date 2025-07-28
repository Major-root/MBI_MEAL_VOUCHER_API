const voucherTypeRoute = require("./src/controllers/voucherTypeController");
const authRoute = require("./src/controllers/authController");
const holidayRoute = require("./src/controllers/holidayController");
const voucherRoute = require("./src/controllers/voucherController");
const userRoute = require("./src/controllers/userController");
const paymentRoute = require("./src/controllers/paymentController");
const walletTransactionsRoute = require("./src/controllers/walletTransactionsController");
const orderRoute = require("./src/controllers/orderController");
const vendorRoute = require("./src/controllers/vendorController");
const accRoute = require("./src/controllers/accountController");

const apiPrefix = "/api/v1";

const routes = [
  { route: voucherTypeRoute, prefix: "/voucher-type" },
  { route: authRoute, prefix: "/auth" },
  { route: holidayRoute, prefix: "/holiday" },
  { route: voucherRoute, prefix: "/voucher" },
  { route: userRoute, prefix: "/user" },
  { route: paymentRoute, prefix: "/payment" },
  { route: walletTransactionsRoute, prefix: "/wallet-transactions" },
  { route: orderRoute, prefix: "/order" },
  { route: vendorRoute, prefix: "/vendor" },
  { route: accRoute, prefix: "/account" },
];

module.exports = (app) => {
  routes.forEach((element) => {
    app.use(`${apiPrefix}${element.prefix}`, element.route);
  });

  return app;
};

// const { customAlphabet } = require("nanoid");

// // SportyBet-style code alphabet (no 0/O or 1/I for clarity)
// const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
// const generateBetCode = customAlphabet(alphabet, 7); // 7-char code

// function createBetCode() {
//   return generateBetCode(); // e.g. "7XK9MZ2"
// }

// // Example usage:
// console.log("Your bet code is:", createBetCode());
