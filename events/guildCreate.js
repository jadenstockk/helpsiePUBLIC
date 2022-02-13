const Discord = require('discord.js');
const config = require('../config.json');
const errorhandler = require('../errorhandler');
const errHandler = require('../errorhandler');
const checkforerrors = require('../functions/moderation/checkforerrors');
const pushUpdates = require('../pushUpdates');
const guildLogs = new Discord.WebhookClient(config.guildlogID, config.guildlogTOKEN);

module.exports = {
    init: (client) => {

        client.on('guildCreate', async (guild) => {

            try {
                await client.database.fetchGuildData(guild.id, client);

                let owner = guild.owner;
                if (!owner) owner = 'Unknown', owneruser = 'Unknown';
                else owner = owner.user.tag, owneruser = guild.owner;

                client.users.cache.get('541189322007904266').send(`**New Guild:**\n\nName: ${guild.name}\nMember Count: ${guild.memberCount}\nOwner: ${owner}\n‎‎‎‎‎Total Guilds: ${client.guilds.cache.size}`);

                //pushUpdates(`New Guild`, `Name: ${guild.name}\nMember Count: ${guild.memberCount}\nOwner: ${owner}\n‎‎‎‎‎Total Guilds: ${client.guilds.cache.size}`);
                guildLogs.send(new Discord.MessageEmbed().setDescription(`**📥 Joined new guild:**\n\n**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Member Count:** \`${guild.memberCount}\`\n**Owner:** ${owner} (${owneruser})\n‎‎‎‎‎    `).setColor("#00FF7F").setThumbnail(guild.iconURL()).setFooter(`Total Guilds: ${client.guilds.cache.size}`, client.user.displayAvatarURL())).catch(err => {
                    errorhandler.init(err, __filename);
                })

                if (checkforerrors(guild, false, false, ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS'], client)) return;

                const prefix = client.settings.get(guild.id).prefix;

                let welcomeEmbed = new Discord.MessageEmbed()
                    .setColor("#059DFF")
                    .setAuthor(`Thanks for adding me to your server!`, client.user.displayAvatarURL())
                    .setDescription(`Hi there I'm ${client.user.username}. A powerful multipurpose Discord bot with features varying from moderation to birthday reminders. ${client.user.username} makes it easy to create and customize your Discord server to your liking with a simple setup process!\n\n**Type \`${prefix}setup\` to begin the setup process and start customizing ${client.user.username} to your liking**`)
                    .setFooter(`Want to get straight into the commands? Type ${prefix}help for a list of commands`)
                    .setThumbnail(client.user.displayAvatarURL())

                let channel = guild.channels.cache.find(x => x.type === 'text').id;

                const welcome = client.channels.cache.get(channel);

                welcome.send(welcomeEmbed).catch(err => {errHandler.init(err, __filename)});

            } catch (err) {
                errHandler.init(err, __filename);

            }
        })
    }
}