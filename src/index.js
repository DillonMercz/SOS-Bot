require("dotenv").config;
const Discord = require("discord.js");
const { WebSocketServer } = require("ws");
// const client = new Discord.Client();
const ws = require("ws");
const app = require("express")();
const server = require("http").createServer(app);
const fs = require("fs");
// const io = require("socket.io")(server);
const { OpusEncoder } = require("@discordjs/opus");
const twilioConfig = require("./twilioConfig");
const wss = new ws.Server({ server });
const path = require("path");
const { PassThrough } = require("stream");
const TwilioMediaStreamSaveAudioFile = require("twilio-media-stream-save-audio-file");
// const __dirname = './twilio-audio'
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
const readChunks = async (readable) => {
  readable.setEncoding("binary");
  let data = "";
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
};

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
  mediaStreamSaver.setWebsocket(ws);
  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
        mediaStreamSaver.twilioStreamStart();
        try{
          ws.rstream = fs.createReadStream(__dirname + `/${Date.now()}.wav`);
          buffer = readChunks(ws.rstream);
          encoded = encoder.encode(buffer);
          decoded = encoder.decode(encoded);
        }
        catch(e){
          console.log(e)
        }
        break;
      case "media":
        console.log("Receiving audio...");
        mediaStreamSaver.twilioStreamMedia(msg.media.payload);
        try{
          ws.rstream = fs.createReadStream(__dirname + `/${Date.now()}.wav`);
          buffer = readChunks(ws.rstream);
          encoded = encoder.encode(buffer);
          decoded = encoder.decode(encoded);
        }
        catch(e){
          console.log(e)
        }
        break;
      case "stop":
        console.log("Call has ended");
        mediaStreamSaver.twilioStreamStop();
        break;
      default:
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
