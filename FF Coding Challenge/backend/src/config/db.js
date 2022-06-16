const mongoose = require("mongoose");
const { CLUSTER_PASSWORD } = require("../utils/constants");

module.exports = () => {
  return mongoose
    .connect(
      `mongodb+srv://rahulkumar:${CLUSTER_PASSWORD}@cluster0.ehtvoss.mongodb.net/test`
    )
    .then(() => {
      console.log("connection established");
    })
    .catch((err) => {
      console.log(err);
    });
};
