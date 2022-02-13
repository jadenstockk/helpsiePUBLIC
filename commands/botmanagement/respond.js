module.exports = {
    commands: 'respond',

    callback: (message, args, client) => {
        const Discord = require("discord.js");
        const config = require('../../config.json');
        const dmLogs = new Discord.WebhookClient(config.dmsID, config.dmsTOKEN);

        if (message.author.id === '541189322007904266') {
            let user = message.mentions.users.first() || client.users.cache.get(args[0]);
            let response = args.slice(1).join(' ');

            if (!user || !response) return;

            let files = message.attachments.first();
            if (!files) dm = new Discord.MessageEmbed()
                .setDescription(`**Sent to ${user}**\n${response}`)
                .setColor(process.env['EMBED_COLOR'])

            else dm = new Discord.MessageEmbed()
                .setDescription(`**Sent to ${user}**\n${response}`)
                .setColor(process.env['EMBED_COLOR'])
                .attachFiles(files)

            user.send(dm);
            dmLogs.send(dm);
        }
    },
};