require("dotenv").config;
// const Discord = require('discord.js');
const { WebSocketServer } = require("ws");
// const client = new Discord.Client();
const ws = require("ws");
const app = require("express")();
const server = require("http").Server(app);
// const io = require("socket.io")(server);
const twilioConfig = require("./twilioConfig");
const wss = new ws.Server({ server });
// constants
const port = process.env.PORT || 8080;
const discordToken = process.env.DISCORD_TOKEN;
const inviteLink = "";
// commands
const PREFIX = "*";
const _CMD_HELP = PREFIX + "help";
const _CMD_END_CALL = PREFIX + "endcall";
const _CMD_LEAVE = PREFIX + "leave";
const _CMD_DEBUG = PREFIX + "debug";
const _CMD_TEST = PREFIX + "test";
const _CMD_RESET = PREFIX + "reset";
const _CMD_CONVOLOG = PREFIX + "convo";
// help function
const getHelp = () =>
  `Usage: *[COMMAND] [ARGUMENTS]\n displays this help message: ${_CMD_HELP}\n ends call of the user \n ${_CMD_END_CALL} [USER]\n displays the conversation logs of the user ${_CMD_CONVOLOG} [USER] \n`;
const guildMap = new Map();
let voiceConnection;

// client.on("start", function(start){
//   console.log(`channelCreate: ${start}`);
// });

// connection callback
const connectionWssFunc = (ws) => {
  console.log("New connection Established");
  let recognizeStream = null;

  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);
        break;
      case "start":
        console.log(`Starting Media Stream ${msg.streamSid}`);
        // Create Stream to the Google Speech to Text API
        recognizeStream = client
          .streamingRecognize(request)
          .on("error", console.error)
          .on("data", (data) => {
            console.log(data.results[0].alternatives[0].transcript);
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    event: "interim-transcription",
                    text: data.results[0].alternatives[0].transcript,
                  })
                );
              }
            });
          });
        break;
      case "media":
        // Write Media Packets to the recognize stream
        console.log(`Audio being Recieved...`);
        recognizeStream.write(msg.media.payload);
        break;
      case "stop":
        console.log(`Call Has Ended`);
        recognizeStream.destroy();
        break;
    }
  });
};
// io.on('connection', connectionwssfunc)
// listen callback
wss.on("connection", connectionWssFunc);
const listenfunc = () => console.log("server running");
server.listen(port, listenfunc);
