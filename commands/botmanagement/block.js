const botInfo = require("../../models/botInfo");

module.exports = {
    commands: 'block',

    callback: async (message, args, client) => {
        const Discord = require("discord.js");

        if (message.author.id === '541189322007904266') {
            let user = message.mentions.users.first() || client.users.cache.get(args[0]);
            let reason = args.slice(1).join(' ');
            if (!user || !reason) return;

            if (user.id === message.author.id) return message.channel.send(`\`🔴 operation aborted\``);

            let data = await botInfo.findOne({ mainID: 1 });
            if (data.blacklistedUsers.find(person => person.user === user.id)) return;

            data.blacklistedUsers.push({ user: user.id, reason });
            data.save();

            try {
                message.channel.send(`\`🟢 operation successful\``);
                client.console.log(`\`⚠ ${user.tag} has been blacklisted for reason: ${reason}\``, undefined, client);
                user.send(`\`⚠ You have been blacklisted for reason: ${reason}\``).catch(err);

            } catch(err) {

            }

            client.blacklistedUsers = data.blacklistedUsers;
        }
    },
};