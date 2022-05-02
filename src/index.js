const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once('Ready', () =>{
    console.log('SOS-bot online');
});

client.login('OTcwNDgyMDAyNzYxNTEwOTky.GwYjqz.tboaTowHzpZyqwu1b3Rkh1p6xBxNip2EzKn7o4');


