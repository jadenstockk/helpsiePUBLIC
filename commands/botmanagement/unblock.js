const botInfo = require("../../models/botInfo");

module.exports = {
    commands: 'unblock',

    callback: async (message, args, client) => {
        const Discord = require("discord.js");

        if (message.author.id === '541189322007904266') {
            let user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) return;

            let data = await botInfo.findOne({ mainID: 1 });
            let blacklisted = data.blacklistedUsers.find(person => person.user === user.id);
            if (!blacklisted) return message.channel.send(`\`🔴 operation unsuccessful\``);

            data.blacklistedUsers.pop(blacklisted);
            data.save();

            try {
                message.channel.send(`\`🟢 operation successful\``);
                client.console.log(`\`⚠ ${user.tag} has been unblacklisted\``, undefined, client);
                user.send(`\`🟢 You have been unblacklisted\``);

            } catch(err) {

            }

            client.blacklistedUsers = data.blacklistedUsers;
        }
    },
};