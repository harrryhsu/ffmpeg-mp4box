const express = require("express");
const app = express();

app.use(express.static("public"));

const port = process.env.port;
module.exports = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
