const converter = require('pretty-ms');
const prettyBytes = require('pretty-bytes');
const Discord = require("discord.js");
const prettyMilliseconds = require('pretty-ms');
const spacetime = require('spacetime');

module.exports = {
    commands: 'stats',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {Discord.Client} client 
     */

    callback: async (message, args, client) => {

        if (message.author.id === '541189322007904266') {
            message.channel.send(`\`\`\`[${spacetime.now(`Africa/Johannesburg`).time()} ${spacetime.now(`Africa/Johannesburg`).format('YYYY-MM-DD')}]: Shard #${client.shard.ids || 'Unknown'} is online in ${client.guilds.cache.size} guilds\nAPI Ping ${client.ws.ping}ms | Uptime ${prettyMilliseconds(client.uptime)} | Memory ${prettyBytes(process.memoryUsage().heapUsed)}\`\`\``);
        }
    },
};