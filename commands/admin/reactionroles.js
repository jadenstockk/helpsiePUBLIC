const Discord = require("discord.js");
const {
    updateGuildData
} = require("../../database");
const checkforerrors = require("../../functions/moderation/checkforerrors");

module.exports = {
    commands: 'reactionroles',
    permissions: 'ADMINISTRATOR',
    permissionMessage: true,
    botPermissions: 'MANAGE_ROLES',
    description: `Use this command to create or delete reaction roles (when a user reacts to specific message with a specific reaction, they gain a role)`,
    usage: `[optional new or delete] - (leaving the optional part out will provide a list of existing reaction roles)`,
    group: 'admin',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     * @param {Discord.Client} client 
     * @returns 
     */

    callback: async (message, args, client) => {
        const prefix = client.settings.get(message.guild.id).prefix;
        const settings = client.settings.get(message.guild.id);
        let reactionRoles = settings.reactionRoles;

        let reactionrolesMaybe = [];
        if (reactionRoles && reactionRoles.length > 0) reactionrolesMaybe.push(`**Reaction Roles:**`);

        settings.reactionRoles.forEach((role, index) => {
            reactionrolesMaybe.push(`**${index + 1}. Emoji: ${role.emoji} | Role: ${message.guild.roles.cache.get(role.role)} | [Jump to message](https://discord.com/channels/${message.guild.id}/${role.channel}/${role.message})**`);
        });

        let reactionCommands = [
            `**Reaction Role Commands:**`,
            `\`${prefix}reactionroles new <channel> <message link/id> <emoji> <role>\``,
            `\`${prefix}reactionroles delete <reaction role list number>\``
        ]

        let reactionCommand = args[0];

        if (reactionCommand === 'new') {

            if (reactionRoles.length >= settings.limits.reactionroles) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} You are only allowed a maximum of ${settings.limits.reactionroles} reaction roles`)
                .setColor("#FF3E3E")
            )

            const settinginfos = args;
            settinginfos.shift();

            if ((!settinginfos) || (settinginfos.length < 1)) return message.channel.send(new Discord.MessageEmbed().setAuthor(`Reaction Role Creator`, message.guild.iconURL()).setDescription(`To create a new Automod Action, use the command as follows:\n**${prefix}reactionroles new \`<channel>\` \`<message link/id>\` \`<emoji>\` \`<role>\`**\n\nWhen members react with \`<emoji>\` on \`<message link/id>\` in \`<channel>\` they get \`<role>\`, and when they unreact, \`<role>\` gets removed from them`).setColor(process.env['EMBED_COLOR']));

            let reactionrole = {
                channel: settinginfos[0],
                message: settinginfos[1],
                emoji: settinginfos[2],
                role: settinginfos[3]
            }

            if (reactionrole.channel) reactionrole.channel = reactionrole.channel.replace('<', '').replace('#', '').replace('>', '');
            if (reactionrole.role) reactionrole.role = reactionrole.role.replace('<', '').replace('@', '').replace('&', '').replace('>', '');

            let channelFetch = client.channels.cache.get(reactionrole.channel);

            if ((!reactionrole.channel) || (!channelFetch)) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Please provide a valid channel`)
                .setColor("#FF3E3E")
            )

            if (reactionrole.message) {
                if (reactionrole.message.startsWith('https://discord.com/channels/')) {
                    let messageIDSplit = reactionrole.message.split('/');

                    reactionrole.message = messageIDSplit[6];
                }
            }

            let messageFetch = await channelFetch.messages.fetch(reactionrole.message).catch(err => {
                return
            })

            if ((!reactionrole.message) || (!messageFetch)) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Please provide a valid message link/id`)
                .setColor("#FF3E3E")
            )

            if (messageFetch.partial) messageFetch = await messageFetch.fetch();

            if ((!reactionrole.emoji)) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Please provide a valid emoji`)
                .setColor("#FF3E3E")
            )

            let roleFetch = message.guild.roles.cache.get(reactionrole.role);

            if ((!reactionrole.role) || (!roleFetch)) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Please provide a valid role`)
                .setColor("#FF3E3E")
            )

            if (reactionRoles.find(rr => rr.message === reactionrole.message && rr.role === reactionrole.role && rr.emoji === reactionrole.emoji)) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} There is already a reaction role on that message that has the same emoji and role as you provided`)
                .setColor("#FF3E3E")
            )

            if (roleFetch.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`).setColor("#FF3E3E"));

            let checkErrors = checkforerrors(message.guild, roleFetch, false, ['MANAGE_ROLES'], client);
            if (checkErrors) return message.channel.send(checkErrors);

            try {
                await messageFetch.react(reactionrole.emoji);

                reactionRoles.push(reactionrole);

                await updateGuildData(message.guild.id, client, 'reactionRoles', reactionRoles);

                message.channel.send(new Discord.MessageEmbed().setDescription(`${checkEmoji} New reaction role addded succesfully: **[Jump to message](https://discord.com/channels/${message.guild.id}/${channelFetch.id}/${messageFetch.id})**`).setColor("#00FF7F"));

            } catch (err) {

                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} There was an error with the emoji you chose, please try again with a different one`)
                    .setColor("#FF3E3E")
                )
            }

        } else if (reactionCommand === 'delete') {

            if ((!reactionRoles) || (reactionRoles.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No reaction roles have been created`).setColor("#FF3E3E").setFooter(`Type "${prefix}reactionroles new" to create a new reaction role`));
            let deleteNumber = args[1];
            let role = reactionRoles[deleteNumber - 1];

            if ((!deleteNumber) || (isNaN(deleteNumber) || (!role))) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please provide a valid reaction role number from the list`).setColor("#FF3E3E").setFooter(`Type "${prefix}reactionroles" for a list of reaction roles you've created`));

            message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Actions`, message.guild.iconURL()).setDescription(`**${checkEmoji} Confirm / ${nopeEmoji} Deny delete reaction role:**\n\n**Emoji: ${role.emoji} | Role: ${message.guild.roles.cache.get(role.role)} | [Jump to message](https://discord.com/channels/${message.guild.id}/${role.channel}/${role.message})**`).setColor("#FF3E3E"))
                .then(async msg => {

                    await msg.react(checkEmoji);
                    await msg.react(nopeEmoji);

                    msg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === checkEmoji || reaction.emoji === nopeEmoji)), {
                        max: 1,
                        time: 120000
                    }).then(async sendCollected => {

                        if (sendCollected.first().emoji === checkEmoji) {

                            msg.delete();

                            let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Reaction role successfully deleted: **Emoji: ${role.emoji} | Role: ${message.guild.roles.cache.get(role.role)} | [Jump to message](https://discord.com/channels/${message.guild.id}/${role.channel}/${role.message})**`).setColor("#00FF7F"));

                            reactionRoles.splice(reactionRoles.indexOf(role), 1);

                            await updateGuildData(message.guild.id, client, 'reactionRoles', reactionRoles);

                            message.channel.send(success);

                        } else {

                            msg.edit(
                                new Discord.MessageEmbed()
                                .setDescription(`${nopeEmoji} Cancelled deleting of reaction role`)
                                .setColor("#FF3E3E")
                            )
                            msg.reactions.removeAll();
                        }

                    }).catch(() => {

                        msg.edit(
                            new Discord.MessageEmbed()
                            .setDescription(`${nopeEmoji} Cancelled deleting of reaction role`)
                            .setColor("#FF3E3E")
                        )
                        msg.reactions.removeAll();
                    });
                })

        } else {
            let reactionRolesList = new Discord.MessageEmbed()
                .setColor(process.env['EMBED_COLOR'])
                .setAuthor(`Reaction Roles`, client.user.displayAvatarURL())
                .setDescription(reactionCommands.join('\n') + '\n\n' + reactionrolesMaybe.join('\n\n'))

            message.channel.send(reactionRolesList);
        }
    }
};