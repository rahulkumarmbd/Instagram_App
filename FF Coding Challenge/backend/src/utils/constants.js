const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  CLUSTER_PASSWORD: process.env.CLUSTER_PASSWORD,
};
