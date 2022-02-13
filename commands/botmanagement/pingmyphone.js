const pushUpdates = require("../../pushUpdates");

module.exports = {
    commands: 'pingmyphone',

    callback: async (message, args, client) => {
        const Discord = require("discord.js");

        if (message.author.id === '541189322007904266') {
            if (!args[0]) return;

            await pushUpdates('Ping My Phone', args.slice(0).join(' '));
            message.channel.send(`\`🟢 Sent\``);
        }
    },
};