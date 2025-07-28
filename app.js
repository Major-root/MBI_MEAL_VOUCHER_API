const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const appRouter = require("./route");
const errorController = require("./src/controllers/errorController");
const AppError = require("./src/utils/appError");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/callback", (req, res) => {
  res.send(
    `<h1>Payment Callback Received</h1><p>Reference: ${req.query.reference}</p>`
  );
});

app.get("/cancel-payment", (req, res) => {
  res.send(
    `<h1>Payment Cancelled</h1><p>You have cancelled the payment process.</p>`
  );
});
app.use("/public", express.static(path.join(__dirname, "src/public")));

appRouter(app);

app.use("", (req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  throw new AppError(
    `This route does not exist➡️ ${req.method} ${req.originalUrl}`,
    404
  );
});

app.use(errorController);

module.exports = app;
