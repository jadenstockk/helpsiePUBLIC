const Discord = require("discord.js");
const errorhandler = require("../../errorhandler");
const guildData = require('../../models/guildData');
const userData = require("../../models/userData");
const checkforerrors = require("../moderation/checkforerrors");

module.exports = {
  name: 'lololololololol',
  description: 'settings update',

  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   * @param {Discord.Client} client 
   * @param {*} setting 
   * @param {*} settinginfo 
   * @param {*} currentSettings 
   * @returns 
   */

  async execute(message, args, client, setting, settinginfo, currentSettings) {
    const clientMember = message.guild.members.cache.get(client.user.id);

    setting = setting.toLowerCase();

    if (setting === 'prefix') {

      let prefix = currentSettings.prefix;

      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current prefix is set to: \`${prefix}\``).setColor("#059DFF"))

      if (settinginfo === prefix) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Prefix is already set to: \`${prefix}\``).setColor("#FF3E3E"))

      let success = new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set prefix to: \`${settinginfo}\``).setColor("#00FF7F")

      await updateSettings('prefix', settinginfo, success);


    } else if (setting === 'logs') {

      let checkPerms = checkforerrors(message.guild, false, false, ['MANAGE_WEBHOOKS'], client);
      if (checkPerms) return message.channel.send(checkPerms);

      if ((!settinginfo && !currentSettings.logsChannel) || (!settinginfo && !message.guild.channels.cache.get(currentSettings.logsChannel.channelID))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Server logs channel is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current server logs channel is set to: ${message.guild.channels.cache.get(currentSettings.logsChannel.channelID)}`).setColor("#059DFF"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set server logs channel to: ${settinginfo}`).setColor("#00FF7F"))

      if (settinginfo === 'off') return logsDelete(), await updateSettings('logs', undefined, success);

      async function logsDelete() {

        if (!currentSettings.logsChannel) return;

        let channel = message.guild.channels.cache.get(currentSettings.logsChannel.channelID);
        if (channel) {
          let webhooks = await channel.fetchWebhooks();
          let webhook = webhooks.find(webhook => webhook.id === currentSettings.logsChannel.id);
          if (webhook) webhook.delete();
        }

      }

      let logschannel = settinginfo.replace('<', '')
      logschannel = logschannel.replace('>', '')
      logschannel = logschannel.replace('#', '')

      logschannel = message.guild.channels.cache.get(logschannel);

      let checkForWebhook = false;

      if (!logschannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The channel you entered is not valid`).setColor("#FF3E3E"))

      if (currentSettings.logsChannel) {
        let channelWebhooks = await logschannel.fetchWebhooks();
        channelWebhooks.forEach(webhook => {
          if (webhook.id === currentSettings.logsChannel.id) checkForWebhook = true;
        })
        if (checkForWebhook) {
          if (logschannel.id === currentSettings.logsChannel.channelID) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Server logs channel is already set to: ${settinginfo}`).setColor("#FF3E3E"))
        }
      }

      await logschannel.createWebhook(`${client.user.username} Webhooks`, {
        avatar: client.user.displayAvatarURL(),

      }).then(webhook => logschannelWebhook = {
        token: webhook.token,
        id: webhook.id,
        channelID: logschannel.id
      })

      logsDelete(), await updateSettings('logs', logschannelWebhook, success);


    } else if (setting === 'moderator') {

      if (!settinginfo && !currentSettings.modRole) return message.channel.send(new Discord.MessageEmbed().setDescription(`Moderator role is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Moderator role is set to: ${message.guild.roles.cache.get(currentSettings.modRole)}`).setColor("#059DFF"))

      let modrole = message.guild.roles.cache.get(settinginfo.replace('<', '').replace('>', '').replace('@', '').replace('&', ''));

      if (!modrole) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered is not valid`).setColor("#FF3E3E"))
      if (modrole.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`).setColor("#FF3E3E"));

      let checkErrors = checkforerrors(message.guild, modrole, false, ['MANAGE_ROLES'], client);
      if (checkErrors) return message.channel.send(checkErrors);

      if (modrole.id === currentSettings.modrole) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Moderator role is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set moderator role to: ${settinginfo}`).setColor("#00FF7F"))

      await updateSettings('moderator', modrole.id, success);


    } else if (setting === 'muted') {

      if (!settinginfo && (!currentSettings.muteRole || message.guild.roles.cache.get(currentSettings.muteRole))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Muted role is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Muted role is set to: ${message.guild.roles.cache.get(currentSettings.muteRole)}`).setColor("#059DFF"))

      let muterole = message.guild.roles.cache.get(settinginfo.replace('<', '').replace('>', '').replace('@', '').replace('&', ''));

      if (!muterole) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered is not valid`).setColor("#FF3E3E"))
      if (muterole.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`).setColor("#FF3E3E"));

      let checkErrors = checkforerrors(message.guild, muterole, false, ['MANAGE_ROLES'], client);
      if (checkErrors) return message.channel.send(checkErrors);

      if (muterole.id === currentSettings.muteRole) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Muted role is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set muted role to: ${settinginfo}`).setColor("#00FF7F"))

      await updateSettings('muterole', muterole.id, success);


    } else if (setting === 'profanityfilter') {

      if (!(clientMember.hasPermission('MANAGE_MESSAGES'))) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} Bot is missing permissions: \`Manage Messages\``)
        .setColor("#FF3E3E"))

      let profanityfilter = currentSettings.profanityFilter;

      if (!settinginfo && !profanityfilter) return message.channel.send(new Discord.MessageEmbed().setDescription(`Profanity filter is set to: \`off\``).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Profanity filter is set to: \`${profanityfilter}\``).setColor("#059DFF"))

      if (settinginfo === profanityfilter) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Profanity filter is already set to: \`${settinginfo}\``).setColor("#FF3E3E"))

      if (!(settinginfo === 'warn' || settinginfo === 'off' || settinginfo === 'delete' || settinginfo === 'warndelete')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Profanity filter has to either be set to \`warn\`/\`warndelete\`/\`delete\`/\`off\``).setColor("#FF3E3E"))

      profanityfilter = settinginfo;

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set profanity filter to: \`${settinginfo}\``).setColor("#00FF7F"))

      await updateSettings('profanityfilter', profanityfilter, success);


    } else if (setting === 'inviteblocker') {

      if ((!clientMember.hasPermission('MANAGE_GUILD') && !clientMember.hasPermission('MANAGE_MESSAGES'))) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} Bot is missing permissions: \`Manage Messages\`, \`Manage Server\``)
        .setColor("#FF3E3E"))

      if (!(clientMember.hasPermission('MANAGE_GUILD'))) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} Bot is missing permissions: \`Manage Server\``)
        .setColor("#FF3E3E"))

      if (!(clientMember.hasPermission('MANAGE_MESSAGES'))) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} Bot is missing permissions: \`Manage Messages\``)
        .setColor("#FF3E3E"))

      if (currentSettings.inviteBlocker === true) inviteblocker = 'on';
      else inviteblocker = 'off';

      if (!settinginfo && !currentSettings.inviteBlocker) return message.channel.send(new Discord.MessageEmbed().setDescription(`Invite blocker is set to: \`off\``).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Invite blocker is set to: \`${inviteblocker}\``).setColor("#059DFF"))

      if (settinginfo === inviteblocker) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Invite blocker is already set to: \`${settinginfo}\``).setColor("#FF3E3E"))

      if (!(settinginfo === 'warn' || settinginfo === 'off' || settinginfo === 'delete' || settinginfo === 'warndelete')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Invite blocker has to either be set to \`warn\`/\`warndelete\`/\`delete\`/\`off\``).setColor("#FF3E3E"))

      inviteblocker = settinginfo;

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set invite blocker to: \`${settinginfo}\``).setColor("#00FF7F"))

      await updateSettings('inviteblocker', inviteblocker, success);


    } else if (setting === 'linkblocker') {

      let linkblocker = settinginfo.linkBlocker;

      if (!settinginfo && !currentSettings.linkBlocker) return message.channel.send(new Discord.MessageEmbed().setDescription(`Link blocker is set to: \`off\``).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Link blocker is set to: \`${linkblocker}\``).setColor("#059DFF"))

      if (settinginfo === linkblocker) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Link blocker is already set to: \`${settinginfo}\``).setColor("#FF3E3E"))

      if (!(settinginfo === 'warn' || settinginfo === 'off' || settinginfo === 'delete' || settinginfo === 'warndelete')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Link blocker has to either be set to \`warn\`/\`warndelete\`/\`delete\`/\`off\``).setColor("#FF3E3E"))

      linkblocker = settinginfo;

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set link blocker to: \`${settinginfo}\``).setColor("#00FF7F"))

      await updateSettings('linkblocker', linkblocker, success);


    } else if (setting === 'actions') {

      let automodactions = currentSettings.autoModActions;

      if (settinginfo === 'new') {
        if (automodactions.length >= currentSettings.limits.automodactions) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You are only allowed a maximum of ${currentSettings.limits.automodactions} automod actions`)
          .setColor("#FF3E3E")
        )

        const settinginfos = message.content.toLowerCase().split(/[ ]+/);
        settinginfos.shift();
        settinginfos.shift();
        settinginfos.shift();

        let punishments = ['ban', 'mute', 'kick'];

        if ((!settinginfos) || (settinginfos.length < 1)) return message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Action Creator`, message.guild.iconURL()).setDescription(`To create a new Automod Action, use the command as follows:\n**${currentSettings.prefix}settings actions new \`<type>\` \`[optional mute duration]\` \`<warns>\` \`<time>\`**\n\n\`<type>\` members when they have \`<warns>\` warns or more in the last \`<time>\` minutes\n\n> \`<type>\` - this is the type of punishment (\`kick\`, \`ban\` or \`mute\`)\n> \`<warns>\` - this is the minimum amount of warns the user needs in order for them to be punished\n> \`<time>\` - this is the amount of time the minimum amount of warns applies in minutes *(e.g. if the time is 30 minutes, any warn over 30 minutes ago will not be counted when deciding on whether the member should be punished)*\n> \`[optional mute duration]\` - this part is only necessary if the type of punishment you choose is \`mute\` (it is the amount of time the member will be muted for in minutes)`).setColor("#059DFF"));

        let action = {
          type: settinginfos[0],
          muteduration: null,
          amount: settinginfos[1],
          time: settinginfos[2]
        }

        if (action.type === 'mute') action = {
          type: settinginfos[0],
          muteduration: settinginfos[1],
          amount: settinginfos[2],
          time: settinginfos[3]
        }

        if ((!action.type) || (!punishments.includes(action.type))) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} Please provide a valid action type: \`kick\`, \`ban\` or \`mute\``)
          .setColor("#FF3E3E")
        )

        else if ((action.muteduration !== null) && (isNaN(action.muteduration))) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} Please provide a valid mute duration`)
          .setColor("#FF3E3E")
        )

        else if ((!action.amount) || (isNaN(action.amount))) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} Please provide a valid amount of warns`)
          .setColor("#FF3E3E")
        )

        else if ((!action.time) || (isNaN(action.time))) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} Please provide a valid time (this value must be in minutes)`)
          .setColor("#FF3E3E")
        )

        if (automodactions.find(a => a.type === action.type && a.time === action.time && a.amount === action.amount && a.muteduration === action.muteduration)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} There is already an Automod Action identical to the one you've just created`).setColor("#FF3E3E"));

        let typeString = `**${action.type}** members`;
        if (action.muteduration !== null) typeString = `**${action.type}** members for **${action.muteduration} minutes**`;

        message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Action Creator`, message.guild.iconURL()).setDescription(`**${checkEmoji} Confirm / ${nopeEmoji} Deny new action:**\n\n${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#059DFF"))
          .then(async msg => {

            await msg.react(checkEmoji);
            await msg.react(nopeEmoji);

            msg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === checkEmoji || reaction.emoji === nopeEmoji)), {
              max: 1,
              time: 120000
            }).then(sendCollected => {

              if (sendCollected.first().emoji === checkEmoji) {

                msg.delete();

                automodactions.push(action);

                let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Action added: ${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#00FF7F"));

                updateSettings('automodactions', automodactions, success);

              } else {

                msg.edit(
                  new Discord.MessageEmbed()
                  .setDescription(`${nopeEmoji} Action Creator session cancelled`)
                  .setColor("#FF3E3E")
                )
                msg.reactions.removeAll();
              }

            }).catch(() => {

              msg.edit(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Action Creator session cancelled`)
                .setColor("#FF3E3E")
              )
              msg.reactions.removeAll();
            });
          })

      } else if (settinginfo === 'delete') {
        if ((!automodactions) || (automodactions.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No automod actions have been created`).setColor("#FF3E3E").setFooter(`Type "${currentSettings.prefix}settings actions new" to create a new action`));
        let deleteNumber = args[2];
        let action = automodactions[deleteNumber - 1];

        if ((!deleteNumber) || (isNaN(deleteNumber) || (!action))) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please provide a valid action number`).setColor("#FF3E3E").setFooter(`Type "${currentSettings.prefix}settings actions" for a list of actions you've created`));

        let typeString = `**${action.type}** members`;
        if (action.muteduration !== null) typeString = `**${action.type}** members for **${action.muteduration} minutes**`;

        message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Actions`, message.guild.iconURL()).setDescription(`**${checkEmoji} Confirm / ${nopeEmoji} Deny delete action:**\n\n${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#FF3E3E"))
          .then(async msg => {

            await msg.react(checkEmoji);
            await msg.react(nopeEmoji);

            msg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === checkEmoji || reaction.emoji === nopeEmoji)), {
              max: 1,
              time: 120000
            }).then(sendCollected => {

              if (sendCollected.first().emoji === checkEmoji) {

                msg.delete();

                automodactions.splice(automodactions.indexOf(action), 1);

                let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Action successfully deleted: ${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#00FF7F"));

                updateSettings('automodactiondelete', automodactions, success);

              } else {

                msg.edit(
                  new Discord.MessageEmbed()
                  .setDescription(`${nopeEmoji} Cancelled deleting of action`)
                  .setColor("#FF3E3E")
                )
                msg.reactions.removeAll();
              }

            }).catch(() => {

              msg.edit(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Cancelled deleting of action`)
                .setColor("#FF3E3E")
              )
              msg.reactions.removeAll();
            });
          })



      } else {
        if ((!automodactions) || (automodactions.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No automod actions have been created`).setColor("#FF3E3E").setFooter(`Type "${currentSettings.prefix}settings actions new" to create a new action`));

        let actionlist = [];

        automodactions.forEach((action, index) => {

          let typeString = `**${action.type}** members`;
          if (action.muteduration !== null) typeString = `**${action.type}** members for **${action.muteduration} minutes**`;

          actionlist.push(`\`${index + 1}.\` ${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`);

        })

        message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Actions`, message.guild.iconURL()).setDescription(actionlist.join('\n\n')).setFooter(`Type "${currentSettings.prefix}settings actions new" to create a new action or "${currentSettings.prefix}settings actions delete <action number>" to delete an action on the list`).setColor("#059DFF"));
      }


    } else if (setting === 'welcomechannel') {

      if ((!settinginfo && !currentSettings.welcome.channel) || (!settinginfo && !message.guild.channels.cache.get(currentSettings.welcome.channel))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Welcome channel is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current welcome channel is set to: ${message.guild.channels.cache.get(currentSettings.welcome.channel)}`).setColor("#059DFF"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set welcome channel to: ${settinginfo}`).setColor("#00FF7F"));

      let currentchannel;
      if (currentSettings.welcome) currentchannel = currentSettings.welcome.channel;

      let welcomechannel = settinginfo.replace('<', '')
      welcomechannel = welcomechannel.replace('>', '')
      welcomechannel = welcomechannel.replace('#', '')

      welcomechannel = message.guild.channels.cache.get(welcomechannel);

      if (!welcomechannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The channel you entered is not valid`).setColor("#FF3E3E"))

      if (welcomechannel.id === currentchannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Welcome channel is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      await updateSettings('welcomechannel', welcomechannel.id, success);


    } else if (setting === 'birthdaymessage') {

      if ((!settinginfo && !currentSettings.birthdays.message)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Birthday message is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current birthday message is set to: ${currentSettings.birthdays.message}`).setColor("#059DFF"))

      settinginfo = args.splice(1).join(' ');

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set birthday message to: ${settinginfo}`).setColor("#00FF7F"));

      let currentmessage;
      if (currentSettings.birthdays) currentmessage = currentSettings.birthdays.message;
      let birthdaymessage = settinginfo;

      if (birthdaymessage === 'off') return updateSettings('birthdaymessage', undefined, success);

      if (birthdaymessage === currentmessage) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Birthday message is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      await updateSettings('birthdaymessage', birthdaymessage, success);


    } else if (setting === 'birthdaychannel') {

      if ((!settinginfo && !currentSettings.birthdays.channel) || (!settinginfo && !message.guild.channels.cache.get(currentSettings.birthdays.channel))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Birthday channel is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current birthday channel is set to: ${message.guild.channels.cache.get(currentSettings.welcome.channel)}`).setColor("#059DFF"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set birthday channel to: ${settinginfo}`).setColor("#00FF7F"));

      let currentchannel;
      if (currentSettings.birthdays) currentchannel = currentSettings.birthdays.channel;

      let birthdaychannel = settinginfo.replace('<', '')
      birthdaychannel = birthdaychannel.replace('>', '')
      birthdaychannel = birthdaychannel.replace('#', '')

      birthdaychannel = message.guild.channels.cache.get(birthdaychannel);

      if (!birthdaychannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The channel you entered is not valid`).setColor("#FF3E3E"))

      if (birthdaychannel.id === currentchannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Birthday channel is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      await updateSettings('birthdaychannel', birthdaychannel.id, success);


    } else if (setting === 'birthdayrole') {

      if (!settinginfo && (!currentSettings.birthdays.role || message.guild.roles.cache.get(currentSettings.birthdays.role))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Birthday role is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Birthday role is set to: ${message.guild.roles.cache.get(currentSettings.birthdays.role)}`).setColor("#059DFF"))

      if (settinginfo.toLowerCase() === 'off') return updateSettings('birthdayrole', undefined, success);

      let birthdayrole = message.guild.roles.cache.get(settinginfo.replace('<', '').replace('>', '').replace('@', '').replace('&', ''));

      if (!birthdayrole) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered is not valid`).setColor("#FF3E3E"));
      if (birthdayrole.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`).setColor("#FF3E3E"));

      let checkErrors = checkforerrors(message.guild, birthdayrole, false, ['MANAGE_ROLES'], client);
      if (checkErrors) return message.channel.send(checkErrors);

      if (birthdayrole.id === currentSettings.birthdays.role) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Birthday role is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set birthday role to: ${settinginfo}`).setColor("#00FF7F"))

      await updateSettings('birthdayrole', birthdayrole.id, success);

    } else if (setting === 'welcomemessage') {

      if ((!settinginfo && !currentSettings.welcome.message)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Welcome message is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current welcome message is set to: ${currentSettings.welcome.message}`).setColor("#059DFF"))

      settinginfo = args.splice(1).join(' ');

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set welcome message to: ${settinginfo}`).setColor("#00FF7F"));

      let currentmessage;
      if (currentSettings.welcome) currentmessage = currentSettings.welcome.message;
      let welcomemessage = settinginfo;

      if (welcomemessage === 'off') return updateSettings('welcomemessage', undefined, success);

      if (welcomemessage === currentmessage) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Welcome message is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      await updateSettings('welcomemessage', welcomemessage, success);


    } else if (setting === 'welcomerole') {

      if (!settinginfo && (!currentSettings.welcome.role || message.guild.roles.cache.get(currentSettings.welcome.role))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Welcome role is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Welcome role is set to: ${message.guild.roles.cache.get(currentSettings.welcome.role)}`).setColor("#059DFF"))

      if (settinginfo.toLowerCase() === 'off') return updateSettings('welcomerole', undefined, success);

      let welcomerole = message.guild.roles.cache.get(settinginfo.replace('<', '').replace('>', '').replace('@', '').replace('&', ''));

      if (!welcomerole) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered is not valid`).setColor("#FF3E3E"));
      if (welcomerole.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The role you entered has admin permissions and is therefore not allowed to be used due to security purposes`).setColor("#FF3E3E"));

      let checkErrors = checkforerrors(message.guild, welcomerole, false, ['MANAGE_ROLES'], client);
      if (checkErrors) return message.channel.send(checkErrors);

      if (welcomerole.id === currentSettings.welcome.role) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Welcome role is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set welcome role to: ${settinginfo}`).setColor("#00FF7F"))

      await updateSettings('welcomerole', welcomerole.id, success);


    } else if (setting === 'levelchannel') {

      if ((!settinginfo && !currentSettings.leveling.channel) || (!settinginfo && !message.guild.channels.cache.get(currentSettings.leveling.channel))) return message.channel.send(new Discord.MessageEmbed().setDescription(`Leveling channel is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current leveling channel is set to: ${message.guild.channels.cache.get(currentSettings.leveling.channel)}`).setColor("#059DFF"))

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set leveling channel to: ${settinginfo}`).setColor("#00FF7F"));

      let currentchannel;
      if (currentSettings.leveling) currentchannel = currentSettings.leveling.channel;

      let levelingchannel = settinginfo.replace('<', '')
      levelingchannel = levelingchannel.replace('>', '')
      levelingchannel = levelingchannel.replace('#', '')

      if (levelingchannel === 'off') return updateSettings('levelingchannel', undefined, success);

      levelingchannel = message.guild.channels.cache.get(levelingchannel);

      if (!levelingchannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The channel you entered is not valid`).setColor("#FF3E3E"))

      if (levelingchannel.id === currentchannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Leveling channel is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      await updateSettings('levelingchannel', levelingchannel.id, success);


    } else if (setting === 'levelmessage') {

      if ((!settinginfo && !currentSettings.leveling.message)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Leveling message is not setup`).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Current leveling message is set to: ${currentSettings.leveling.message}`).setColor("#059DFF"))

      settinginfo = args.splice(1).join(' ');

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set leveling message to: ${settinginfo}`).setColor("#00FF7F"));

      let currentmessage;
      if (currentSettings.leveling) currentmessage = currentSettings.leveling.message;
      let levelingmessage = settinginfo;

      if (levelingmessage === 'off') return updateSettings('levelingmessage', undefined, success);

      if (levelingmessage === currentmessage) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Leveling message is already set to: ${settinginfo}`).setColor("#FF3E3E"))

      await updateSettings('levelingmessage', levelingmessage, success);


    } else if (setting === 'levelroles') {
      const guild = message.guild;

      let levelroles = currentSettings.leveling.roles;

      if (settinginfo === 'new') {
        if (levelroles.length >= currentSettings.limits.levelroles) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You are only allowed a maximum of ${currentSettings.limits.levelroles} level roles`)
          .setColor("#FF3E3E")
        )

        const settinginfos = message.content.toLowerCase().split(/[ ]+/);
        settinginfos.shift();
        settinginfos.shift();
        settinginfos.shift();

        if ((!settinginfos) || (settinginfos.length < 1)) return message.channel.send(new Discord.MessageEmbed().setAuthor(`Level Role Creator`, message.guild.iconURL()).setDescription(`To create a new level role, use the command as follows:\n**${currentSettings.prefix}settings levelroles new \`<level>\` \`<role>\`**\n\nWhen members reach level \`<level>\`, they will get \`<role>\`\n\n> \`<level>\` - this is the level that the member is required to reach to get the role\n> \`<role>\` - this is the role that the member gets if they reach the required level`).setColor("#059DFF"));

        let levelrole = {
          level: settinginfos[0],
          role: settinginfos[1]
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

        updateSettings('levelroles', levelroles, success);

        levelroles.push(levelrole);

        levelroles.sort(function (a, b) {
          return a.level - b.level
        });

        userData.find({
            guild: guild.id
          },

          async (err, data) => {
            data.forEach((user, index) => {
              let levelrolesREFRESHED = levelroles.toObject();
              levelroles.forEach((role, index) => {

                if (user.level >= role.level) {
                  try {

                    let rolesToAdd = levelrolesREFRESHED.splice(0, index + 1);
                    rolesToAdd.forEach(role => {
                      guild.members.cache.get(user.user).roles.add(role.role);
                    })

                  } catch (err) {
                    errorhandler.init(err, __filename);
                  }
                }

              })
            })
          }
        )

      } else if (settinginfo === 'delete') {

        if ((!levelroles) || (levelroles.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No level roles have been created`).setColor("#FF3E3E").setFooter(`Type "${currentSettings.prefix}settings levelroles new" to create a new level role`));
        let deleteNumber = args[2];
        let levelrole = levelroles[deleteNumber - 1];

        if ((!deleteNumber) || (isNaN(deleteNumber) || (!levelrole))) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please provide a valid level role number from the list`).setColor("#FF3E3E").setFooter(`Type "${currentSettings.prefix}settings levelroles" for a list of level roles you've created`));

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

                levelroles.splice(levelroles.indexOf(levelrole), 1);

                updateSettings('levelrolesdelete', levelroles, success);

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
        if ((!levelroles) || (levelroles.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No level roles have been created`).setColor("#FF3E3E").setFooter(`Type "${currentSettings.prefix}settings levelroles new" to create a new level role`));

        let levelrolelist = [];

        levelroles.forEach((levelrole, index) => {

          levelrolelist.push(`\`${index + 1}.\` **Level ${levelrole.level}**  ➡  **${message.guild.roles.cache.get(levelrole.role)}**`);

        })

        message.channel.send(new Discord.MessageEmbed().setAuthor(`Level Roles`, message.guild.iconURL()).setDescription(levelrolelist.join('\n\n')).setFooter(`Type "${currentSettings.prefix}settings levelroles new" to create a new level role or "${currentSettings.prefix}settings levelroles delete <level role number>" to delete a level role on the list`).setColor("#059DFF"));
      }


    } else if (setting === 'tips') {
      function simplify(value) {
        if (value) return 'on';
        else return 'off';
      }

      if ((!settinginfo && !currentSettings.tips)) return message.channel.send(new Discord.MessageEmbed().setDescription(`Tips is currently set to: \`off\``).setColor("#059DFF"))
      if (!settinginfo) return message.channel.send(new Discord.MessageEmbed().setDescription(`Tips is currently is set to: \`${simplify(currentSettings.tips)}\``).setColor("#059DFF"))

      settinginfo = args.splice(1).join(' ');

      let success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully set tips to: \`${settinginfo}\``).setColor("#00FF7F"));

      let currenttips;
      if (currentSettings.tips) currenttips = currentSettings.tips;
      let tips = settinginfo;

      if (tips === 'off') return await updateSettings('tips', false, success);

      if (tips === currenttips) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Tips is already set to: \`${settinginfo}\``).setColor("#FF3E3E"))

      if (!(settinginfo === 'off' || settinginfo === 'on')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Tips has to either be set to \`on\` or \`off\``).setColor("#FF3E3E"))

      await updateSettings('tips', true, success);


    } else {
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} Could not find the setting: \`${setting}\`\n*type* \`${currentSettings.prefix}settings\` *for a list of settings*`)
        .setColor("#FF3E3E")
      )
    }

    async function updateSettings(type, newsetting, success) {
        await guildData.findOne({
            guild: message.guild.id
          },
          async (err, data) => {
            if (err) console.log(err);
            if (!data) {

              if (type === 'prefix') newData = new guildData({
                guild: message.guild.id,
                prefix: newsetting
              });
              else if (type === 'logs') newData = new guildData({
                guild: message.guild.id,
                logsChannel: newsetting
              });
              else if (type === 'moderator') newData = new guildData({
                guild: message.guild.id,
                modRole: newsetting
              });
              else if (type === 'muterole') newData = new guildData({
                guild: message.guild.id,
                muteRole: newsetting
              });
              else if (type === 'profanityfilter') newData = new guildData({
                guild: message.guild.id,
                profanityFilter: newsetting
              });
              else if (type === 'inviteblocker') newData = new guildData({
                guild: message.guild.id,
                inviteBlocker: newsetting
              });
              else if (type === 'linkblocker') newData = new guildData({
                guild: message.guild.id,
                linkBlocker: newsetting
              });
              else if (type === 'automodactions') newData = new guildData({
                guild: message.guild.id,
                autoModActions: [newsetting]
              });
              else if (type === 'automodactiondelete') return;
              else if (type === 'levelrolesdelete') return;
              else if (type === 'levelroles') newData = new guildData({
                guild: message.guild.id,
                leveling: {
                  roles: [newsetting]
                }
              });
              else if (type === 'welcomechannel') newData = new guildData({
                guild: message.guild.id,
                welcome: {
                  channel: newsetting,
                }
              });
              else if (type === 'welcomemessage') newData = new guildData({
                guild: message.guild.id,
                welcome: {
                  message: newsetting,
                }
              });
              else if (type === 'welcomerole') newData = new guildData({
                guild: message.guild.id,
                welcome: {
                  role: newsetting,
                }
              });
              else if (type === 'birthdaychannel') newData = new guildData({
                guild: message.guild.id,
                birthdays: {
                  channel: newsetting,
                }
              });
              else if (type === 'birthdaymessage') newData = new guildData({
                guild: message.guild.id,
                birthdays: {
                  message: newsetting,
                }
              });
              else if (type === 'birthdayrole') newData = new guildData({
                guild: message.guild.id,
                birthdays: {
                  role: newsetting,
                }
              });
              else if (type === 'levelingchannel') newData = new guildData({
                guild: message.guild.id,
                leveling: {
                  channel: newsetting,
                }
              });
              else if (type === 'levelingmessage') newData = new guildData({
                guild: message.guild.id,
                leveling: {
                  message: newsetting,
                }
              });
              else if (type === 'tips') newData = new guildData({
                guild: message.guild.id,
                tips: newsetting
              });

              await message.channel.send(success);

              await newData.save();

              await client.database.fetchGuildData(message.guild.id, client);

            } else {

              if (type === 'prefix') data.prefix = newsetting;
              else if (type === 'logs') data.logsChannel = newsetting;
              else if (type === 'moderator') data.modRole = newsetting;
              else if (type === 'muterole') data.muteRole = newsetting;
              else if (type === 'profanityfilter') data.profanityFilter = newsetting;
              else if (type === 'inviteblocker') data.inviteBlocker = newsetting;
              else if (type === 'linkblocker') data.linkBlocker = newsetting;
              else if (type === 'automodactions') data.autoModActions = newsetting;
              else if (type === 'automodactiondelete') data.autoModActions = newsetting;

              else if (type === 'welcomechannel') data.welcome.channel = newsetting;
              else if (type === 'welcomemessage') data.welcome.message = newsetting;
              else if (type === 'welcomerole') data.welcome.role = newsetting;

              else if (type === 'birthdaychannel') data.birthdays.channel = newsetting;
              else if (type === 'birthdaymessage') data.birthdays.message = newsetting;
              else if (type === 'birthdayrole') data.birthdays.role = newsetting;

              else if (type === 'levelingchannel') data.leveling.channel = newsetting;
              else if (type === 'levelingmessage') data.leveling.message = newsetting;
              else if (type === 'levelroles') data.leveling.roles = newsetting;
              else if (type === 'levelrolesdelete') data.leveling.roles = newsetting;

              else if (type === 'tips') data.tips = newsetting;

              await message.channel.send(success);

              await data.save();

              await client.database.fetchGuildData(message.guild.id, client, false, data);

            }
          }
        );
    }
  }
}