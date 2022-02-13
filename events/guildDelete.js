const Discord = require('discord.js');
const config = require('../config.json');
const errHandler = require('../errorhandler');
const guildLogs = new Discord.WebhookClient(config.guildlogID, config.guildlogTOKEN);

module.exports = {
    init: (client) => {

        client.on('guildDelete', guild => {
            try {
                let owner = guild.owner;
                if (!owner) owner = 'Unknown', owneruser = 'Unknown';
                else owner = owner.user.tag, owneruser = guild.owner;

                client.users.cache.get('541189322007904266').send(`**Removed from Guild:**\n\nName: ${guild.name}\nMember Count: ${guild.memberCount}\nOwner: ${owner}\n‎‎‎‎‎Total Guilds: ${client.guilds.cache.size}`);

                guildLogs.send(new Discord.MessageEmbed().setDescription(`**📤 Removed from guild:**\n\n**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Member Count:** \`${guild.memberCount}\`\n**Owner:** ${owner} (${owneruser})\n‎‎‎‎‎    `).setColor("#FF3E3E").setThumbnail(guild.iconURL()).setFooter(`Total Guilds: ${client.guilds.cache.size}`, client.user.displayAvatarURL()))
                client.database.fetchGuildData(guild.id, client)

            } catch (err) {
                errHandler.init(err, __filename);

            }
        })
    }
}