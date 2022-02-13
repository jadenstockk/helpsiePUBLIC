const Discord = require("discord.js");
const update = require("./update");
const errorhandler = require("../../../errorhandler");
const userData = require("../../../models/userData");
const checkforerrors = require("../../moderation/checkforerrors");

module.exports = (input, current, message, args, info, client) => {
    const guild = message.guild;

    let levelroles = current.leveling.roles;

    if (input === 'new') {
        if (levelroles.length >= current.limits.levelroles) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} You are only allowed a maximum of ${current.limits.levelroles} level roles`)
            .setColor("#FF3E3E")
        )

        const inputArgs = message.content.toLowerCase().split(/[ ]+/);
        inputArgs.shift();
        inputArgs.shift();
        inputArgs.shift();

        if ((!inputArgs) || (inputArgs.length < 1)) return message.channel.send(new Discord.MessageEmbed().setAuthor(`Level Role Creator`, message.guild.iconURL()).setDescription(`To create a new level role, use the command as follows:\n**${current.prefix}settings levelroles new \`<level>\` \`<role>\`**\n\nWhen members reach level \`<level>\`, they will get \`<role>\`\n\n> \`<level>\` - this is the level that the member is required to reach to get the role\n> \`<role>\` - this is the role that the member gets if they reach the required level`).setColor("#059DFF"));

        let levelrole = {
            level: inputArgs[0],
            role: inputArgs[1]
        }

        let role;

        if (levelrole.level) levelrole.level = parseInt(levelrole.level);
        if (levelrole.role) levelrole.role = levelrole.role.replace('<', '').replace('@', '').replace('&', '').replace('>', ''), role = message.guild.roles.cache.get(levelrole.role);

        if ((!levelrole.level) || (levelrole.level > 300)) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} Please provide a valid level number (ensure that it's below 300)`)
            .setColor("#FF3E3E")
        )

        else if ((!levelrole.role) || (!role)) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} Please provide a valid role`)
            .setColor("#FF3E3E")
        )

        if (role.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`).setColor("#FF3E3E"));

        let checkErrors = checkforerrors(message.guild, role, false, ['MANAGE_ROLES'], client);
        if (checkErrors) return message.channel.send(checkErrors);

        if (levelroles.find(role => role.role === levelrole.role && role.level === levelrole.level)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} There is already a level role identical to the one you've just created`).setColor("#FF3E3E"));

        let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Level role added: When members reach **level ${levelrole.level}**, they will get ${role}`).setColor("#00FF7F"));

        levelroles.push(levelrole);

        update(levelroles, info, input, message, client, success);

        levelroles.sort(function (a, b) {
            return a.level - b.level
        });

        userData.find({
                guild: guild.id
            },

            async (err, data) => {
                data.forEach((user, index) => {

                    if (user.level >= levelrole.level) {
                        try {

                            guild.members.cache.get(user.user).roles.add(levelrole.role);

                        } catch (err) {
                            errorhandler.init(err, __filename);
                        }
                    }
                })
            }
        )

    } else if (input === 'delete') {

        if ((!levelroles) || (levelroles.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No level roles have been created`).setColor("#FF3E3E").setFooter(`Type "${current.prefix}settings levelroles new" to create a new level role`));
        let deleteNumber = args[2];
        let levelrole = levelroles[deleteNumber - 1];

        if ((!deleteNumber) || (isNaN(deleteNumber) || (!levelrole))) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please provide a valid level role number from the list`).setColor("#FF3E3E").setFooter(`Type "${current.prefix}settings levelroles" for a list of level roles you've created`));

        message.channel.send(new Discord.MessageEmbed().setAuthor(`Level Roles`, message.guild.iconURL()).setDescription(`**${checkEmoji} Confirm / ${nopeEmoji} Deny delete action:**\n\nWhen members reach **level ${levelrole.level}**, they will get **${message.guild.roles.cache.get(levelrole.role)}**`).setColor("#FF3E3E"))
            .then(async msg => {

                await msg.react(checkEmoji);
                await msg.react(nopeEmoji);

                msg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === checkEmoji || reaction.emoji === nopeEmoji)), {
                    max: 1,
                    time: 120000
                }).then(sendCollected => {

                    if (sendCollected.first().emoji === checkEmoji) {

                        msg.delete();

                        let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Level role successfully deleted: When members reach **level ${levelrole.level}**, they will get **${message.guild.roles.cache.get(levelrole.role)}**`).setColor("#00FF7F"))

                        levelroles.splice(levelroles.indexOf(levelrole - 1), 1);

                        update(levelroles, info, input, message, client, success);

                    } else {

                        msg.edit(
                            new Discord.MessageEmbed()
                            .setDescription(`${nopeEmoji} Cancelled deleting of level role`)
                            .setColor("#FF3E3E")
                        )
                        msg.reactions.removeAll();
                    }

                }).catch(() => {

                    msg.edit(
                        new Discord.MessageEmbed()
                        .setDescription(`${nopeEmoji} Cancelled deleting of level role`)
                        .setColor("#FF3E3E")
                    )
                    msg.reactions.removeAll();
                });
            })

    } else {

        let levelrolelist = [];
        let invalidRoles = false;

        levelroles.forEach((levelrole, index) => {

            let role = message.guild.roles.cache.get(levelrole.role);
            if (!role) {

                invalidRoles = true;
                levelroles.splice(levelroles.indexOf(levelrole - 1), 1);
                return;

            }
            levelrolelist.push(`\`${index + 1}.\` **Level ${levelrole.level}**  ➡  **${role || 'Deleted Role'}**`);

        })

        if (invalidRoles) update(levelroles, info, input, message, client, 3);

        if ((!levelroles) || (levelroles.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No level roles have been created`).setColor("#FF3E3E").setFooter(`Type "${current.prefix}settings levelroles new" to create a new level role`));
        message.channel.send(new Discord.MessageEmbed().setAuthor(`Level Roles`, message.guild.iconURL()).setDescription(levelrolelist.join('\n\n')).setFooter(`Type "${current.prefix}settings levelroles new" to create a new level role or "${current.prefix}settings levelroles delete <level role number>" to delete a level role on the list`).setColor("#059DFF"));
    }
}