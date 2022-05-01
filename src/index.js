require('dotenv').config;
const Discord = require('discord.js');
const client = new Discord.Client();
const app = require('express')();
const server = require('http').Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;
const listenfunc = () => console.log('server running');
const discordToken = process.env.DISCORD_TOKEN
const inviteLink = "";
const connectionwssfunc = () => console.log('user is connected')
// commands
const PREFIX = '*';
const _CMD_HELP        = PREFIX + 'help';
const _CMD_END_CALL        = PREFIX + 'endcall';
const _CMD_LEAVE       = PREFIX + 'leave';
const _CMD_DEBUG       = PREFIX + 'debug';
const _CMD_TEST        = PREFIX + 'test';
const _CMD_RESET       = PREFIX + 'reset';
const _CMD_CONVOLOG       = PREFIX + 'convo';

// help function

const getHelp = () => `Usage: *[COMMAND] [ARGUMENTS]\n displays this help message: ${_CMD_HELP}\n ends call of the user \n ${_CMD_END_CALL} [USER]\n displays the conversation logs of the user ${_CMD_CONVOLOG} [USER] \n`
const guildMap = new Map()
let voiceConnection;

// client.on("start", function(start){
//   console.log(`channelCreate: ${start}`);
// });

io.on('connection', connectionwssfunc)

server.listen(port, listenfunc)