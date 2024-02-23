const path = require("path");

module.exports = {
  entry: "./public/worker.js",
  output: {
    filename: "worker.min.js",
    path: path.resolve(__dirname, "public"),
  },
  mode: "production",
};
