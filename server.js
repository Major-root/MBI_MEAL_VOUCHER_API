const app = require("./app");
const { dB } = require("./src/database/authDataBase");
const config = require("./src/utils/config");

// if (config.env === "production") {
//   dotenv.config();
// } else {
//   dotenv.config({ path: ".env" });
// }

const PORT = config.port || 8080;
dB.auth();

app.listen(PORT, () => {
  console.log(`App is running 🚀 on ${PORT}.`);
});
