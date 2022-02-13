const Discord = require("discord.js");
const errorhandler = require("../../errorhandler");
const guildData = require('../../models/guildData');
const userData = require("../../models/userData");
const base = require("./settingsdata/settings.json");
const checkforerrors = require("../moderation/checkforerrors");
const actions = require("./settingsdata/actions");
const update = require("./settingsdata/update");
const levelroles = require("./settingsdata/levelroles");

module.exports = {
    name: 'settings',
    description: 'update settings',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Discord.Client} client 
     * @param {String} setting 
     * @param {String} input 
     * @param {Object} current 
     */

    async execute(message, args, client, setting, input, current) {

        const me = message.guild.me;
        const info = base.find(a => a.setting === setting);
        setting = setting.toLowerCase();

        let {
            prefix,

        } = current;



        if (!info) {
            return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Could not find the setting: \`${setting}\`\n*type* \`${prefix}settings\` *for a list of settings*`)
                .setColor("#FF3E3E")
            )
        }





        let NEW;
        let CURRENT = eval('current.' + info.eval);
        if (info.exception) CURRENT = eval('current.' + info.exception);







        function display(value, special) {

            try {
                if (value && special) {
                    if (special === 'channel') value = message.guild.channels.cache.get(value) || '\`Channel not found\`';
                    else if (special === 'role') value = message.guild.roles.cache.get(value) || '\`Role not found\`';
                    else if (special === 'message' && value === 'off') value === '\`off\`';
                    else if (special === 'on/off') return '\`on\`';

                } else if (value && !special) {
                    value = `\`${value}\``;
                }

                if (!value && (!special)) value = 'off';
                else if (!value && special) return '\`off\`';

                return value;

            } catch (err) {
                errorhandler.init(err, __filename);
            }
        }

        function status(value, normal) {

            if (normal) {
                if (!value || value.length < 1) return {
                    emoji: neutralEmoji,
                    color: null
                }
                else return {
                    emoji: neutral2Emoji,
                    color: '89FF9B'
                }
            }

            if ((value && (typeof value === 'string' || typeof value === 'boolean')) || (value && (value.length > 0) && typeof value === 'object')) {
                if (value === 'off') {
                    return {
                        emoji: disabledEmoji,
                        color: null
                    }

                } else {
                    return {
                        emoji: enabledEmoji,
                        color: '89FF9B'
                    }
                }

            } else {
                return {
                    emoji: disabledEmoji,
                    color: null
                }
            }
        }









        if (info.perms) {
            let checkPerms = checkforerrors(message.guild, false, false, info.perms, client);
            if (checkPerms) return message.channel.send(checkPerms);

        }

        if (!info.popout) {
            if (!input) {

                if (!CURRENT || (CURRENT && CURRENT.length < 1)) {
                    return message.channel.send(
                        new Discord.MessageEmbed()
                        .setDescription(`${disabledEmoji} ${info.name.slice(0, 1).toUpperCase() + info.name.slice(1)} is not set up`)
                    )

                } else {
                    let statusInfo = status(CURRENT, info.noDisabled);

                    return message.channel.send(
                        new Discord.MessageEmbed()
                        .setDescription(`${statusInfo.emoji} Current ${info.name} is set to: ${display(CURRENT, info.type)}`)
                        .setColor(statusInfo.color)
                    )
                }
            }
        }





        if (info.allowedArgs) {
            let allowedArgsFormatted = [];
            info.allowedArgs.forEach(arg => {
                allowedArgsFormatted.push(`\`${arg}\``)

            })

            if (!info.allowedArgs.includes(input)) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} ${info.name.slice(0, 1).toUpperCase() + info.name.slice(1)} has to either be set to: ${allowedArgsFormatted.join('/')}`)
                .setColor("#FF3E3E")
            )
        }






        if (info.offEnabled) {

            if (input === 'off') {
                if (info.logsDelete) {
                    logsDelete();
                    NEW = undefined;
                }
                if (info.type === 'on/off') {
                    NEW = false;
                    
                } else {
                    NEW = undefined;
                    return await update(NEW, info, input, message, client);
                }

            } else if (input === 'on') {
                if (info.type === 'on/off') {
                    NEW = true;
                }
            }
        }










        if (info.type && (info.type === 'channel')) {
            input = input.replace('<', '');
            input = input.replace('>', '');
            input = input.replace('#', '');

            channel = message.guild.channels.cache.get(input);

            if (!channel) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} The channel you entered is not valid`)
                    .setColor("#FF3E3E")
                )
            }


        } else if (info.type && (info.type === 'channels')) {
            input = args.slice(1).join(' ').replace(/\s+/g, '');
            arrayedInput = input.split(',');

            input = [];
            channels = [];

            arrayedInput.forEach(i => {
                x = i.replace('<', '');
                x = x.replace('>', '');
                x = x.replace('#', '');

                input.push(x);

                x = message.guild.channels.cache.get(x);

                if (!x) {
                    if (input.length < 2) {
                        return message.channel.send(
                            new Discord.MessageEmbed()
                            .setDescription(`${nopeEmoji} The channel you entered is not valid`)
                            .setColor("#FF3E3E")
                        )
                    } else {
                        return message.channel.send(
                            new Discord.MessageEmbed()
                            .setDescription(`${nopeEmoji} One of the channels you entered is not valid`)
                            .setColor("#FF3E3E")
                        )
                    }
                }

                channels.push(x);
            })


        } else if (info.type && (info.type === 'role')) {
            input = input.replace('<', '');
            input = input.replace('>', '');
            input = input.replace('@', '');
            input = input.replace('&', '');

            role = message.guild.roles.cache.get(input);

            if (!role) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} The role you entered is not valid`)
                    .setColor("#FF3E3E")
                )
            }


            if (info.checkRole) {
                let checkErrors = checkforerrors(message.guild, role, false, false, client);
                if (checkErrors) return message.channel.send(checkErrors);

            }

        } else if (info.type && (info.type === 'message')) {
            input = args.slice(1).join(' ');

        }

        NEW = input;

        if (input === CURRENT) {
            if (!info.logsDelete) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} Current ${info.name} is already set to: ${display(CURRENT, info.type)}`)
                    .setColor("#FF3E3E")
                )
            }

        }

















        if (NEW) {
            if (setting === 'logs') {

                let checkForWebhook = false;
                if (CURRENT) {
                    let channelWebhooks = await channel.fetchWebhooks();
                    channelWebhooks.forEach(webhook => {
                        if (webhook.id === CURRENT) checkForWebhook = true;
                    })
                    if (checkForWebhook) {
                        if (channel.id === CURRENT) return message.channel.send(
                            new Discord.MessageEmbed()
                            .setDescription(`${nopeEmoji} Current ${info.name} is already set to: ${display(CURRENT, info.type)}`)
                            .setColor("#FF3E3E")
                        )
                    }
                }

                await channel.createWebhook(`${client.user.username} Webhooks`, {
                    avatar: client.user.displayAvatarURL(),

                }).then(webhook => logschannelWebhook = {
                    token: webhook.token,
                    id: webhook.id,
                    channelID: channel.id
                })

                NEW = logschannelWebhook;
                logsDelete();








            } else if (setting === 'muted') {

                if (role.permissions.has('ADMINISTRATOR')) return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`)
                    .setColor("#FF3E3E")
                )
            }
        }









        if (setting === 'actions') {
            return actions(input, current, message, args, info, client);









        } else if (setting === 'levelroles') {
            return levelroles(input, current, message, args, info, client);







        }






        async function logsDelete() {

            if (!CURRENT) return;

            let channel = message.guild.channels.cache.get(CURRENT);
            if (channel) {
                let webhooks = await channel.fetchWebhooks();
                let webhook = webhooks.find(webhook => webhook.id === current.logsChannel.id);
                if (webhook) webhook.delete();
            }
        }







        await update(NEW, info, input, message, client);
    }
}