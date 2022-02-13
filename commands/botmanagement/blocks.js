const botInfo = require("../../models/botInfo");

module.exports = {
    commands: 'blocks',

    callback: async (message, args, client) => {
        const Discord = require("discord.js");

        if (message.author.id === '541189322007904266') {
            let user = message.mentions.users.first() || client.users.cache.get(args[0]);

            let data = await botInfo.findOne({ mainID: 1 });
            data = data.blacklistedUsers.toObject();
            if (!data) return;

            let blacklisted;
            if (user) blacklisted = data.find(person => person.user === user.id);

            client.blacklistedUsers = data;

            if (!user || !blacklisted) message.channel.send(`\`${require('util').inspect(data)}\``); 
            else message.channel.send(`**Block appeal of ${user.tag}**\n\`${require('util').inspect(blacklisted)}\``);
        }
    },
};