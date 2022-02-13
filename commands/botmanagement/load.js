const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');

module.exports = {
    commands: 'load',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {Discord.Client} client 
     */

    callback: (message, args, client) => {
        if (message.author.id === '541189322007904266') {
            const selection = args.slice(0).join(' ');
            if (!selection) return;
            message.channel.send(`\`🟠 Loading ${selection}...\``).then(async msg => {
                if (selection === 'restart shards') {

                    await client.shard.send('restart_');

                } else {
                    msg.edit('`No load found`');
                }
            })
        }
    },
};