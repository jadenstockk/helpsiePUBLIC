const Discord = require("discord.js");

module.exports = {
    commands: 'embed',
    permissions: 'ADMINISTRATOR',
    permissionMessage: true,
    botPermissions: ['ADD_REACTIONS'],
    description: `Use this command to walk through the embed creator and create beautiful message embeds`,
    usage: ``,
    group: 'admin',

    callback: (message, args, client) => {

        message.channel.send(new Discord.MessageEmbed()
            .setColor(process.env['EMBED_COLOR'])
            .setAuthor(`Embed Creator | Step 1/5`, client.user.displayAvatarURL())
            .setDescription(`What channel do you want to send the embed in?`)).then(mainMsg => {

            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10000
            }).then(channelCollected => {

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelCollected.first().content.replace('#', '').replace('<', '').replace('>', ''))
                if (!channel) return errorInMessageFormat(`You didn't specify a valid channel`)

                channelCollected.first().delete();

                mainMsg.edit(new Discord.MessageEmbed()
                    .setColor(process.env['EMBED_COLOR'])
                    .setAuthor(`Embed Creator | Step 2/5`, client.user.displayAvatarURL())
                    .setDescription(`${checkEmoji} **Channel successfully set to:** ${channel}\n\nWhat do you want the title of the embed to be?`)
                    .setFooter(`Don't want a title? Type 'none' to leave this part out`))

                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000
                }).then(titleCollected => {

                    let title = titleCollected.first().content;
                    if (title.toLowerCase() === 'none') title = ''

                    mainMsg.edit(new Discord.MessageEmbed()
                        .setColor(process.env['EMBED_COLOR'])
                        .setAuthor(`Embed Creator | Step 3/5`, client.user.displayAvatarURL())
                        .setDescription(`${checkEmoji} **Title successfully set to:** ${title}\n\nWhat do you want the description of the embed to be?`)
                        .setFooter(`Don't want a description? Type 'none' to leave this part out`))

                    titleCollected.first().delete();

                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        time: 120000
                    }).then(descriptionCollected => {

                        let description = descriptionCollected.first().content;
                        if (description.toLowerCase() === 'none') description = ''

                        descriptionCollected.first().delete();

                        mainMsg.edit(new Discord.MessageEmbed()
                            .setColor(process.env['EMBED_COLOR'])
                            .setAuthor(`Embed Creator | Step 4/5`, client.user.displayAvatarURL())
                            .setDescription(`${checkEmoji} **Description successfully set to:** ${description}\n\nWhat do you want the footer of the embed to be? Use '!SERVERICON!' in the beginning of your response to add the server's icon at the start of the footer`)
                            .setFooter(`Don't want a footer? Type 'none' to leave this part out`))

                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            time: 60000
                        }).then(footerCollected => {

                            let icon = undefined;

                            if (footerCollected.first().content.includes('!SERVERICON!')) icon = message.guild.iconURL()
                            let footer = footerCollected.first().content.replace('!SERVERICON!', '')
                            if (footer.toLowerCase() === 'none') footer = '';

                            footerCollected.first().delete();

                            mainMsg.edit(new Discord.MessageEmbed()
                                .setColor(process.env['EMBED_COLOR'])
                                .setAuthor(`Embed Creator | Step 5/5`, client.user.displayAvatarURL())
                                .setDescription(`${checkEmoji} **Footer successfully set to:** ${footer}\n\nWhat do you want the color of the embed to be? (for more accurate to your liking colors, use [hex color codes](https://htmlcolorcodes.com/))`)
                                .setFooter(`Want a blank color? Type 'none' to leave this part out`))


                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                time: 120000
                            }).then(async colourCollected => {

                                let colour = colourCollected.first().content;
                                if (colour.toLowerCase() === 'none') colour = '';

                                colourCollected.first().delete();

                                function embed() {
                                    let embed = new Discord.MessageEmbed()

                                    if (title && (title !== '')) embed.setTitle(title);

                                    if (description && (description !== '')) embed.setDescription(description);

                                    if (colour && (colour !== '')) embed.setColor(colour);

                                    if (icon && (footer && (footer !== ''))) embed.setFooter(footer, icon);
                                    else if (footer && (footer !== '')) embed.setFooter(footer);

                                    return embed;
                                }

                                mainMsg.edit(embed());

                                await mainMsg.react(checkEmoji);
                                await mainMsg.react(nopeEmoji);

                                mainMsg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === checkEmoji || reaction.emoji === nopeEmoji)), {
                                    max: 1,
                                    time: 120000
                                }).then(sendCollected => {

                                    if (sendCollected.first().emoji === checkEmoji) {

                                        channel.send(
                                            embed()

                                        ).then(msgSent => {
                                            mainMsg.edit(new Discord.MessageEmbed()
                                                .setDescription(`${checkEmoji} Embed message sent sucessfully in ${channel}`)
                                                .setColor("GREEN"))

                                            mainMsg.reactions.removeAll();

                                        }).catch(err => {
                                            errorInMessageFormat("There was a problem when sending your embed")
                                            mainMsg.delete();
                                        })

                                    } else {
                                        mainMsg.delete();
                                        errorInMessageFormat(`Embed Creater session cancelled`)

                                    }

                                }).catch(() => {

                                    mainMsg.delete();
                                    errorInMessageFormat(`Embed Creater session cancelled`)
                                });

                            }).catch(() => {

                                mainMsg.delete();
                                errorInMessageFormat(`Embed Creater session cancelled`)
                            });

                        }).catch(() => {

                            mainMsg.delete();
                            errorInMessageFormat(`Embed Creater session cancelled`)
                        });

                    }).catch(() => {

                        mainMsg.delete();
                        errorInMessageFormat(`Embed Creater session cancelled`)
                    });

                }).catch(() => {

                    mainMsg.delete();
                    errorInMessageFormat(`Embed Creater session cancelled`)
                });

            }).catch(() => {

                mainMsg.delete();
                errorInMessageFormat(`Embed Creater session cancelled`)
            });
        })

        function errorInMessageFormat(problem) {
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} ${problem}`)
                .setColor("#FF3E3E"))
        }
    }
};