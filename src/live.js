const Stream = require("./stream");
const ws = require("ws");

const wsServer = new ws.Server({
  noServer: true,
  perMessageDeflate: false,
});

wsServer.on("connection", (socket, request) => {
  const stream = new Stream({
    socket,
  });

  stream.start();

  socket.on("close", async () => {
    await stream.stop();
  });
});

module.exports = (express) => {
  express.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (websocket) => {
      wsServer.emit("connection", websocket, request);
    });
  });

  return express;
};
