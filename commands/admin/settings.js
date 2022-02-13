const errorhandler = require("../../errorhandler");
const checkforerrors = require("../../functions/moderation/checkforerrors");
const {
  fetchLatest
} = require("../../main");

module.exports = {
  commands: ['settings', 'config'],
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to get a list of or change the bot's settings to your liking`,
  usage: `[optional setting] [optional new setting option] - leave the optional parts out to get a full list of all the bot's settings`,
  group: 'admin',

  callback: (message, args, client, disbut) => {
    const Discord = require("discord.js");
    const guildData = require('../../models/guildData');

    const prefix = client.settings.get(message.guild.id).prefix;
    const currentSettings = client.settings.get(message.guild.id);
    let commandPrefix = `${prefix}settings`;

    let setting = args[0];
    let settinginfo = args[1];

    function lastestData() {
      let data = fetchLatest(message.guild);

      function setting(type, special) {
        let value = eval(type);

        try {
          if ((value) && special) {
            if (special === 'channel') value = message.guild.channels.cache.get(value);
            else if (special === 'channels') returnedValues = [], value.forEach(v => returnedValues.push(message.guild.channels.cache.get(v))), value = returnedValues.join(', ')
            else if (special === 'roles') returnedValues = [], value.forEach(v => returnedValues.push(message.guild.roles.cache.get(v))), value = returnedValues.join(', ')
            else if (special === 'role') value = message.guild.roles.cache.get(value);
            else if (special === 'message' && value === 'off') return '';
            else if (special === 'on/off') return '\`on\`';

          } else if (!special && value) {
            value = `\`${value}\``;
          }

          if (!value && (!special)) value = 'off';
          else if (!value && special) return '';

          if (value === 'off' || value === '`off`' || !value) return '';
          else return ` - currently set to: ${value}`;

        } catch (err) {
          errorhandler.init(err, __filename);
        }
      }

      function status(type, neutral) {
        let value = eval(type);

        if (neutral) {
          if (!value || value.length < 1) return neutralEmoji;
          else return neutral2Emoji;
        }

        if ((value && (typeof value === 'string' || typeof value === 'boolean')) || (value && (value.length > 0) && typeof value === 'object')) {
          if (value === 'off') {
            return disabledEmoji;

          } else {
            return enabledEmoji;
          }

        } else {
          return disabledEmoji;
        }

      }

      p1 = [
        `**General Settings:**`,
        `${neutral2Emoji} **Prefix**${setting('data.prefix')}\n\`${commandPrefix} prefix <new prefix>\`\nSet a new prefix for the bot *example: ${commandPrefix} prefix ?*\n`,
        `${status('data.tips')} **Tips**\n\`${commandPrefix} tips <on/off>\`\nChoose whether or not you want helpful tips to display when something is configured wrong etc. *example: ${commandPrefix} tips on*\n`,
      ]
      p2 = [
        `**Moderation Settings:**`,
        `${status('data.logsChannel.channelID')} **Logs Channel**${setting('data.logsChannel.channelID', 'channel')}\n\`${commandPrefix} logs <channel/off>\`\nSet a server logs channel where server events will be recorded *example: ${commandPrefix} logs #server-logs*\n`,
        `${status('data.modRole')} **Moderator Role**${setting('data.modRole', 'role')}\n\`${commandPrefix} moderator <role>\`\nSet a role that will have access to moderator commands *example: ${commandPrefix} moderator @moderators*\n`,
        `${status('data.muteRole')} **Mute Role**${setting('data.muteRole', 'role')}\n\`${commandPrefix} muted <role>\`\nSet a role that will be given to members when they are muted *example: ${commandPrefix} muted @mute-role*\n`,
      ]
      p3 = [
        `**Leveling Settings:**`,
        `${status('data.leveling.channel')} **Leveling Channel**${setting('data.leveling.channel', 'channel')}\n\`${commandPrefix} levelchannel <channel/off>\`\nSet a channel where member levelups will be announced *example: ${commandPrefix} levelchannel #level-ups*\n`,
        `${status('data.leveling.message')} **Leveling Message**${setting('data.leveling.message', 'message')}\n\`${commandPrefix} levelmessage <message/off>\`\nSet a message that will be sent when a user levels up - use "{user}" to mention the user that's leveling up, and "{level}" to display the level *example: ${commandPrefix} levelmessage Well done {user} you just reached level {level}! 🥳*\n`,
        `${status('data.leveling.ignoredChannels')} **Leveling Ignored Channels**${setting('data.leveling.ignoredChannels', 'channels')}\n\`${commandPrefix} levelignore <channel/channels/off>\`\nChoose a channel or channels that you don't want to allow members to gain xp and levels in - separate multiple channels with commmas *example: ${commandPrefix} levelignore #no-xp-channel, #media-channel*\n`,
        `${status('data.leveling.roles', true)} **Leveling Roles**\n\`${commandPrefix} levelroles\`\nCreate new level role rewards when members reach a certain level *example: ${commandPrefix} levelroles*\n\n`,
      ]
      p4 = [
        `**Automod Settings:**`,
        `${status('data.profanityFilter')} **Profanity Filter**${setting('data.profanityFilter')}\n\`${commandPrefix} profanityfilter <warn/warndelete/delete/off>\`\nWhen on, the bot will filter bad words in messages, nicknames and links - choose whether you want the bot to warn, delete or warn and delete content containing profanity *example: ${commandPrefix} profanityfilter warndelete*\n`,
        `${status('data.inviteBlocker')} **Invite Blocker**${setting('data.inviteBlocker')}\n\`${commandPrefix} inviteblocker <warn/warndelete/delete/off>\`\nWhen on, the bot will filter all server invite links sent - choose whether you want the bot to warn, delete or warn and delete content containing invite links *example: ${commandPrefix} inviteblocker warndelete*\n`,
        `${status('data.linkBlocker')} **Link Blocker**${setting('data.linkBlocker')}\n\`${commandPrefix} linkblocker <warn/warndelete/delete/off>\`\nWhen on, the bot will delete all links sent - choose whether you want the bot to warn, delete or warn and delete content containing links *example: ${commandPrefix} linkblocker warndelete*\n`,
      ]
      p5 = [
        `**Automod Action Settings:**`,
        `${status('data.autoModActions', true)} **List Automod Actions**\n\`${commandPrefix} actions\`\nGet a list of all the server's automod actions *example: ${commandPrefix} actions*\n\n`,
        `${neutralEmoji} **New Automod Action**\n\`${commandPrefix} actions new\`\nCreate a new action that will either kick, ban or mute a member depending on the number of warnings they've gotten in a certain amount of time *example: ${commandPrefix} actions new*\n`,
        `${neutralEmoji} **Delete Automod Action**\n\`${commandPrefix} actions delete <action number>\`\nDelete an existing automod action *example: ${commandPrefix} actions delete 3*\n\n`,
      ]
      p6 = [
        `**Welcome Settings:**`,
        `${status('data.welcome.channel')} **Welcome Channel**${setting('data.welcome.channel', 'channel')}\n\`${commandPrefix} welcomechannel <channel>\`\nSet a channel where new server members will be greeted *example: ${commandPrefix} welcomechannel #welcome-channel*\n`,
        `${status('data.welcome.message')} **Welcome Message**${setting('data.welcome.message', 'message')}\n\`${commandPrefix} welcomemessage <message/off>\`\nSet a message that will be sent in the welcome channel *example: ${commandPrefix} welcomemessage Hey {user}! Welcome to {server}!*\n`,
        `${status('data.welcome.role')} **Welcome Role**${setting('data.welcome.role', 'role')}\n\`${commandPrefix} welcomerole <role/off>\`\nChoose a role that will be given to new server members when they join *example: ${commandPrefix} welcomerole @member*\n`,
      ]
      p7 = [
        `**Birthday Settings:**`,
        `${status('data.birthdays.channel')} **Birthday Channel**${setting('data.birthdays.channel', 'channel')}\n\`${commandPrefix} birthdaychannel <channel>\`\nSet a channel where member levelups will be announced *example: ${commandPrefix} birthdaychannel #level-ups*\n`,
        `${status('data.birthdays.message')} **Birthday Message**${setting('data.birthdays.message', 'message')}\n\`${commandPrefix} birthdaymessage <message/off>\`\nSet a message that will be sent when it's a user's birthday - use "{user}" to mention the user who's birthday it is *example: ${commandPrefix} birthdaymessage Today is {user}'s Birthday! Make sure you wish them on their special day! 🥳*\n`,
        `${status('data.birthdays.role')} **Birthday Role**${setting('data.birthdays.role', 'role')}\n\`${commandPrefix} birthdayrole <role/off>\`\nChoose a role to give to members when it's their birthday *example: ${commandPrefix} birthdayrole @its-my-birthday*\n`,
      ]
    }

    function CheckForErrors() {
      let checkErrors = checkforerrors(message.guild, false, false, ['ADD_REACTIONS', 'MANAGE_MESSAGES'], client);
      if (checkErrors) return checkErrors;
    }

    let pageNumber = 0;
    let maxPage = 7;

    if (!isNaN(setting)) pageNumber = parseInt(setting) - 1, setting = undefined;
    if ((pageNumber < 0) || (pageNumber > maxPage)) pageNumber = 0;

    if (!setting) {
      if (CheckForErrors()) return message.channel.send(CheckForErrors());

      let button = new disbut.MessageButton()
        .setStyle('blue')
        .setLabel('◀ Back')
        .setID('settings_back')

      let button2 = new disbut.MessageButton()
        .setStyle('blue')
        .setLabel('Next ▶')
        .setID('settings_next')

      message.channel.send(page(pageNumber), {
        buttons: [
          button, button2
        ]
      }).then(msg => {

        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(backwardsFilter, {
          time: 300000
        });
        const forwards = msg.createReactionCollector(forwardsFilter, {
          time: 300000
        });

        backwards.on('collect', r => {
          if (CheckForErrors()) return msg.edit(CheckForErrors());

          try {
            r.users.remove(message.author)

            if (pageNumber === 0) return;

            pageNumber--;
            msg.edit(page(pageNumber))

          } catch (err) {

          }
        })

        forwards.on('collect', r => {
          if (CheckForErrors()) return msg.edit(CheckForErrors());

          try {
            r.users.remove(message.author)

            if (pageNumber === maxPage - 1) return;

            pageNumber++;
            msg.edit(page(pageNumber));

          } catch (err) {

          }
        })

        backwards.on('end', r => {
          if (CheckForErrors()) return msg.edit(CheckForErrors());

          try {
            msg.reactions.removeAll();

          } catch (err) {

          }
        })
      })

      function page(page) {
        lastestData();

        /*
          slice1 = page * 4;
          slice2 = slice1 + 4;
  
          settingsList = new Discord.MessageEmbed()
          .setAuthor(`${message.guild.name} Server Settings:`, message.guild.iconURL())
          .setDescription(allSettings.slice(slice1, slice2).join(''))
          .setFooter(`Page ${page + 1} of ${maxPage}`)
          .setColor("#059DFF")

          return settingsList;
          */

        if (page === 0) list = p1, title = 'General Settings';
        else if (page === 1) list = p2, title = 'Moderation Settings';
        else if (page === 2) list = p3, title = 'Leveling Settings';
        else if (page === 3) list = p4, title = 'Automod Settings';
        else if (page === 4) list = p5, title = 'Automod Action Settings';
        else if (page === 5) list = p6, title = 'Welcome Settings';
        else if (page === 6) list = p7, title = 'Birthday Settings';
        else list = [`Error when loading settings page`], title = 'Unknown';

        settingsList = new Discord.MessageEmbed()
          .setAuthor(`Server Settings Menu:`, client.user.displayAvatarURL())
          .setDescription(list.join('\n\n') + '\n\u200B')
          .setFooter(`Page ${page + 1} of ${maxPage} - ${title}`, client.user.displayAvatarURL())
          .setColor(process.env['EMBED_COLOR'])

        return settingsList;
      }

    } else {

      client.functions.get('settings').execute(message, args, client, setting, settinginfo, currentSettings);

    }
  },
};