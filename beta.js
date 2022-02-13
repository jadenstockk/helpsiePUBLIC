const Discord = require('discord.js');
const client = new Discord.Client;
const config = require('./config.json');

client.once('ready', () => {
    console.log('Beta is now online');

    client.user.setPresence({
        activity: {
            type: 'LISTENING',
            name: 'jaden code',
        },
        status: 'idle'
    })
})

client.login(config.betaToken);