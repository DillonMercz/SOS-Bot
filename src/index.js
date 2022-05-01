const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config;
const token = process.env.DISCORD_TOKEN
var inviteLink = "";

client.on("channelCreate", function(channel){
  console.log(`channelCreate: ${channel}`);
});