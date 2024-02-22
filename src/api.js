const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const cert = fs.readFileSync("cert.pfx");

app.use(express.static("public"));

const port = process.env.port;
module.exports = https
  .createServer(
    {
      pfx: cert,
      passphrase: "1234",
    },
    app
  )
  .listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
