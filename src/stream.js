const child_process = require("child_process");
const Events = require("events");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Stream extends Events {
  constructor(options) {
    super();
    this.options = options;
    this.started = false;
    this.maxInterval = 10;
  }

  error(message) {
    console.error(message);
  }

  info(message) {
    console.info(message);
  }

  async start() {
    const { socket } = this.options;

    this.info(`Stream started`);

    await this.stop();
    this.started = true;

    this.spawnOptions = [
      "-re",
      ...(process.env.target.startsWith("rtsp")
        ? ["-rtsp_transport", "tcp"]
        : []),
      "-i",
      process.env.target,
      "-probesize",
      "32",
      "-analyzeduration",
      "0",
      "-coder",
      "0",
      "-bf",
      "0",
      "-movflags",
      "frag_every_frame+empty_moov+faststart",
      "-c:v",
      "copy",
      "-f",
      "mp4",
      "-",
    ];

    this.info(`Stream ffmpeg args: ${this.spawnOptions.join(" ")}`);

    this.stream = child_process.spawn(process.env.ffmpeg, this.spawnOptions, {
      detached: false,
    });

    this.stream.stdout.on("data", (data) => {
      if (socket.readyState === 1) {
        socket.send(data);
      }
    });
    this.stream.stderr.on("data", (data) => {
      console.log(data.toString());
    });
    this.stream.on("exit", (code, signal) => {
      if (code) this.error(`Stream exited with code: ` + code);
      socket.close();
      this.emit("exit");
    });
  }

  async stop() {
    this.started = false;
    if (this.stream) {
      const { id, name } = this.options;
      this.info(`Stream exited`);
      this.stream.stdin.write("q");
      await sleep(1000);
      this.stream?.kill();
      this.stream = null;
    }
  }
}

module.exports = Stream;
