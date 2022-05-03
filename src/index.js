require("dotenv").config;
const Discord = require("discord.js");
const { WebSocketServer } = require("ws");
// const client = new Discord.Client();
const ws = require("ws");
const app = require("express")();
const server = require("http").createServer(app);
const fs = require("fs")
// const io = require("socket.io")(server);
const { OpusEncoder } = require("@discordjs/opus");
const twilioConfig = require("./twilioConfig");
const wss = new ws.Server({ server });
const path = require("path");
const { PassThrough } = require("stream");
const TwilioMediaStreamSaveAudioFile = require("twilio-media-stream-save-audio-file");
// currently not used
const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
  saveLocation: __dirname,
  saveFilename: `/${Date.now()}.wav`,
  onSaved: () => console.log("File was saved!"),
});
// constants
const PORT = process.env.SERVER_PORT || 8080;
const discordToken = process.env.DISCORD_TOKEN;
const inviteLink = "";

// discord bot commands
const PREFIX = "*";
const _CMD_HELP = PREFIX + "help";
const _CMD_END_CALL = PREFIX + "endcall";
const _CMD_LEAVE = PREFIX + "leave";
const _CMD_DEBUG = PREFIX + "debug";
const _CMD_TEST = PREFIX + "test";
const _CMD_RESET = PREFIX + "reset";
const _CMD_CONVOLOG = PREFIX + "convo";

// help discord bot function
const getHelp = () =>
  `Usage: *[COMMAND] [ARGUMENTS]\n displays this help message: ${_CMD_HELP}\n ends call of the user \n ${_CMD_END_CALL} [USER]\n displays the conversation logs of the user ${_CMD_CONVOLOG} [USER] \n`;
const guildMap = new Map();
let voiceConnection;

// Create the encoder.
// Specify 48kHz sampling rate and 2 channel size.
const encoder = new OpusEncoder(48000, 2);

// take chunks of the stream and put in bufferreader
const readChunks = async readable => {
  readable.setEncoding('binary')
  let data = ''
  for await (const chunk of readable) {
    data += chunk
  }
  return data
}

// Encode and decode.
let buffer;
let encoded;
let decoded;
// client.on("start", function(start){
//   console.log(`channelCreate: ${start}`);
// });

// websocket connection callback
const connectionWssFunc = (ws) => {
  console.log("New connection Established");
  let recognizeStream = null;
  let payload;
  let obj;
  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
        let streamSid = msg.start.streamSid;
        ws.wstream = fs.createWriteStream(__dirname + `/${Date.now()}.wav`, {
          encoding: "binary",
        });
        // This is a mu-law header for a WAV-file compatible with twilio format
        ws.wstream.write(
          Buffer.from([
            0x52,
            0x49,
            0x46,
            0x46,
            0x62,
            0xb8,
            0x00,
            0x00,
            0x57,
            0x41,
            0x56,
            0x45,
            0x66,
            0x6d,
            0x74,
            0x20,
            0x12,
            0x00,
            0x00,
            0x00,
            0x07,
            0x00,
            0x01,
            0x00,
            0x40,
            0x1f,
            0x00,
            0x00,
            0x80,
            0x3e,
            0x00,
            0x00,
            0x02,
            0x00,
            0x04,
            0x00,
            0x00,
            0x00,
            0x66,
            0x61,
            0x63,
            0x74,
            0x04,
            0x00,
            0x00,
            0x00,
            0xc5,
            0x5b,
            0x00,
            0x00,
            0x64,
            0x61,
            0x74,
            0x61,
            0x00,
            0x00,
            0x00,
            0x00 // Those last 4 bytes are the data length
          ])
        );
        ws.rstream = fs.createReadStream(__dirname + `/${Date.now()}.wav`);
        buffer = readChunks(ws.rstream);
        encoded = encoder.encode(buffer);
        decoded = encoder.decode(encoded);
        // Create Stream to the Google Speech to Text API
        // recognizeStream = client
        //   .streamingRecognize(request)
        //   .on("error", console.error)
        //   .on("data", (data) => {
        //     console.log(data.results[0].alternatives[0].transcript);
        //     wss.clients.forEach((client) => {
        //       if (client.readyState === WebSocket.OPEN) {
        //         client.send(
        //           JSON.stringify({
        //             event: "interim-transcription",
        //             text: data.results[0].alternatives[0].transcript,
        //           })
        //         );
        //       }
        //     });
        //   });
        break;
      case "media":
        // Write Media Packets to the recognize stream
        console.log(`Audio being Recieved...`);
        payload = msg.media.payload;
        ws.wstream.write(Buffer.from(payload, "base64"));
        ws.rstream = fs.createReadStream(__dirname + `/${Date.now()}.wav`);
        buffer = readChunks(ws.rstream)
        encoded = encoder.encode(buffer);
        decoded = encoder.decode(encoded);
        // output the variables for view
        obj = { buffer, encoded, decoded, payload }
        console.table(obj);
        // recognizeStream.write(msg.media.payload);
        break;
      case "stop":
        console.log(`Call Has Ended`);
        // recognizeStream.destroy();
        ws.wstream.write("", () => {
          let fd = fs.openSync(ws.wstream.path, 'r+'); // `r+` mode is needed in order to write to arbitrary position
          let count = socket.wstream.bytesWritten;
          count -= 58; // The header itself is 58 bytes long and we only want the data byte length
          console.log(count)
          fs.writeSync(
            fd,
            Buffer.from([
              count % 256,
              (count >> 8) % 256,
              (count >> 16) % 256,
              (count >> 24) % 256,
            ]),
            0,
            4, // Write 4 bytes
            54, // starts writing at byte 54 in the file
          );
        });
        break;
    }
  });
};
// io.on('connection', connectionwssfunc)
// listen callback
app.get("/", (req, res) => res.send("welcome user"));

app.post("/", (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Start>
        <Stream url="wss://${req.headers.host}/"/>
      </Start>
      <Say>This is the SOS-bot. Please remain on the call and an operator will provide help.</Say>
      <Pause length="60" />
    </Response>
  `);
});

wss.on("connection", connectionWssFunc);
//
const listenfunc = () => console.log("server running on " + PORT);
server.listen(PORT, listenfunc);