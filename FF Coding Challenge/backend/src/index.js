const express = require("express");
const eventController = require("./controllers/event.controller");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors());

app.use("/events", eventController);

module.exports = app;
