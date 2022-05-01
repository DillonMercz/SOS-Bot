const Discord = require('discord.js');
const client = new Discord.Client();

const token = ""
var inviteLink = "";

client.on("channelCreate", function(channel){
  console.log(`channelCreate: ${channel}`);
});