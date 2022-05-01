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


client.on("channelCreate", function(channel){
  console.log(`channelCreate: ${channel}`);
});

io.on('connection', connectionwssfunc)

server.listen(port, listenfunc)