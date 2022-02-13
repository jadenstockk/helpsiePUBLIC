const Discord = require("discord.js");

module.exports = {
    commands: 'restart',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {Discord.Client} client 
     */

    callback: (message, args, client) => {
        if (message.author.id === '541189322007904266') {
            message.channel.send(`${loadingEmoji} \`Restarting...\``);
        }
    },
};