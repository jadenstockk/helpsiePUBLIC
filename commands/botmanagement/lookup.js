const Discord = require("discord.js");

module.exports = {
    commands: 'lookup',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {Discord.Client} client 
     */

    callback: (message, args, client) => {

        if (message.author.id === '541189322007904266') {
            let guild = args.slice(0).join(' ');
            guild = client.guilds.cache.get(guild);
            if (!guild) guild = client.guilds.cache.find(g => g.name === guild);

            if (!guild) return message.channel.send("`❌ No results found`");

            let guildResults = [];

            if (typeof guild === "array") {
                guild.forEach(data => {
                    let {
                        name,
                        memberCount,
                        owner,
                        id

                    } = data;

                    let guildData = {
                        name,
                        memberCount,
                        owner: owner.user.tag,
                        id,
                        iconURL: data.iconURL()
                    };

                    guildResults.push(`\`🟢 Guild data for ${name}:\`\n\n\`\`\`${require('util').inspect(guildData)}\`\`\``);

                })

            } else {
                let {
                    name,
                    memberCount,
                    owner,
                    id

                } = guild;

                let guildData = {
                    name,
                    memberCount,
                    owner: owner.user.tag,
                    id,
                    iconURL: guild.iconURL()
                };

                guildResults.push(`\`🟢 Guild data for ${name}:\`\n\n\`\`\`${require('util').inspect(guildData)}\`\`\``);

            }

            message.channel.send(guildResults.join(' '));
        }
    },
};