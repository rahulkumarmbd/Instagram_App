const app = require("./index");
const connection = require("./config/db");
const { PORT } = require("./utils/constants");

const port = PORT || 2001;

app.listen(port, async () => {
  try {
    console.log("listening on port " + port);
    await connection();
  } catch (err) {
    console.log("error", err.message);
  }
});
