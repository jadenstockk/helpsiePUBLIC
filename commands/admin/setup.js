const Discord = require('discord.js');
const {
  fetchLatest
} = require("../../main");

module.exports = {
  commands: 'setup',
  permissions: 'ADMINISTRATOR',
  permissionMessage: true,
  description: `Use this command to setup the bot`,
  usage: ``,
  group: 'admin',

  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   * @param {Discord.Client} client 
   */

  callback: (message, args, client) => {

    const {
      channel
    } = message;
    let current = client.settings.get(message.guild.id);

    function lastestData() {
      let data = fetchLatest(message.guild);

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

      function setting(type, special) {
        let value = eval(type);

        try {
          if (value && special) {
            if (special === 'channel') value = message.guild.channels.cache.get(value);
            else if (special === 'channels') returnedValues = [], value.forEach(v => returnedValues.push(message.guild.channels.cache.get(v))), value = returnedValues.join(', ')
            else if (special === 'role') value = message.guild.roles.cache.get(value);
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

      steps = [{
          c: 'prefix',
          i: `\`${setting('data.prefix')}\``,
          d: `What do you want the server's prefix to be? The server's prefix is the symbol, letter or combination of the two that is used to trigger the bot. For example, if you were to type \`!help\`, the prefix would be \`!\`.\n\n**If you would like to change the current prefix, type a new one now.**`,
          s: 'Prefix',
          e: status('data.prefix', true)
        },
        {
          c: 'logs',
          i: `${setting('data.logsChannel.channelID', 'channel')}`,
          d: `It's important to keep up to date with what's going on in your Discord server. Set up a server logs channel where all moderation events will be recorded so you don't miss anything that's going on. If you would like to set a logs channel, choose a channel and send it now.`,
          s: 'Logging Channel',
          e: status('data.logsChannel.channelID')
        },
        {
          c: 'moderator',
          i: `${setting('data.modRole', 'role')}`,
          d: `A moderator is almost like the housekeeper to a Discord server. Moderators are responsible for taking care of those pesky rule breakers who ruin the fun. Got a group of people who want to do the job of moderators? Great, provide the special moderator role that they have to give them access to a whole new group of moderation commands.`,
          s: 'Moderator Role',
          e: status('data.modRole')
        },
        {
          c: 'levelmessage',
          i: `${setting('data.leveling.message', 'message')}`,
          d: 'Do you want to reward members for being active in your server? Then set up a leveling message that will be sent when they level-up! Levels are based on how many messages a member sends, however, you can only add to your level process once every minute in order to prevent spamming. The recommended level message is: \`**Well done {user} you just reached level {level}!** 🥳\` - if you like the look of this one, just copy and paste it in the chat, else you can make your own custom message. Keep in mind that **\`{user}\`** will be replaced with the member that levels up, and **\`{level}\`** will be replaced with the level the member leveled up to. Provide a level message in chat now.',
          s: 'Level-up Message',
          e: status('data.leveling.message')
        },
        {
          c: 'levelchannel',
          i: `${setting('data.leveling.channel', 'channel')}`,
          d: `Do you have a channel on your server where you want level-up messages to be sent? If you don't set this up, level-up messages will be sent by default in the channel that the member levels up in. If you would like these level-up messages to be sent to a specific channel, choose a channel and send it now.`,
          s: 'Level-up Channel',
          e: status('data.leveling.channel')
        },
        {
          c: 'levelignore',
          i: `${setting('data.leveling.ignoredChannels', 'channels')}`,
          d: `Are there channels on your server where you don't want members to earn xp and levels when they send messages? You can use this feature to disable leveling or ignore certain channels so members can't earn anything from sending messages in those channels. If you have a channel in mind send it now, you can also send multiple channels by separating each one with a comma for example: *#no-xp-channel, #my-cool-channel, #no-levels-for-you*`,
          s: 'Ignored Leveling Channels',
          e: status('data.leveling.ignoredChannels')
        },
        {
          c: 'muted',
          i: `${setting('data.muteRole', 'role')}`,
          d: `\`!mute\` is a fun command to use. Mad at someone? \`!mute\` usually does the trick :) - if you already have a mute role setup on the server, then send it now, else one will be made for you automatically next time you mute someone.`,
          s: 'Mute Role',
          e: status('data.muteRole')
        },
        {
          c: 'profanityfilter',
          i: `\`${setting('data.profanityFilter')}\``,
          d: 'Want to stop those nasty people from swearing and sharing profanity on your server? This this is the perfect feature for you! You can choose whether you want the bot to either:\n\n**Only warn the member** - type `warn`\n**Only delete the message** - type `delete`\n**Warn the member and delete the message** - type `warndelete`',
          s: 'Profanity Filter',
          e: status('data.profanityFilter')
        },
        {
          c: 'inviteblocker',
          i: `\`${setting('data.inviteBlocker')}\``,
          d: 'Want to stop people from sending invite links to other servers on your server? Use this feature to stop those sneaky self advertisers! You can choose whether you want the bot to:\n\n**Only warn the member** - type `warn`\n**Only delete the message** - type `delete`\n**Warn the member and delete the message** - type `warndelete`',
          s: 'Invite Blocker',
          e: status('data.inviteBlocker')
        },
        {
          c: 'linkblocker',
          i: `\`${setting('data.linkBlocker')}\``,
          d: 'Want to stop people from sending links on your server? Use this feature to stop members from sending links! You can choose whether you want the bot to:\n\n**Only warn the member** - type `warn`\n**Only delete the message** - type `delete`\n**Warn the member and delete the message** - type `warndelete`',
          s: 'Link Blocker',
          e: status('data.linkBlocker')
        },
        {
          c: 'welcomemessage',
          i: `${setting('data.welcome.message', 'message')}`,
          d: 'Want new members to feel welcome when the join the server? Choose a message you want to greet new members with when they join. You can customize this by using **\`{user}\`**, which will be replaced with the user that joined. If you want this feature, type out a message in chat now.',
          s: 'Welcome Message',
          e: status('data.welcome.message')
        },
        {
          c: 'welcomechannel',
          i: `${setting('data.welcome.channel', 'channel')}`,
          d: 'If you have set up a welcome message, choose a channel in which you want to the message to be sent in when new members join. If you have a channel in mind, send it now.',
          s: 'Welcome Channel',
          e: status('data.welcome.channel')
        },
        {
          c: 'welcomerole',
          i: `${setting('data.welcome.role', 'role')}`,
          d: 'Want new members to be given a role when they join the server? You can do this by making a special role for them that they get when they join. If you like the sound of this, choose a role you want to give to new members when they join the server and send it now.',
          s: 'Welcome Role',
          e: status('data.welcome.role')
        },
        {
          c: 'birthdaymessage',
          i: `${setting('data.birthdays.message', 'message')}`,
          d: 'Want members to feel special on their birthday? Choose a message you want to send each time it\'s someone\'s birthday. You can customize this by using **\`{user}\`**, which will be replaced with the user whose birthday it is. If you want this feature, type out a message in chat now.',
          s: 'Birthday Message',
          e: status('data.birthdays.message')
        },
        {
          c: 'birthdaychannel',
          i: `${setting('data.birthdays.channel', 'channel')}`,
          d: 'If you have set up a birthday message, choose a channel in which you want to the message to be sent in when it\'s a member\'s birthday. If you have a channel in mind, send it now.',
          s: 'Birthday Channel',
          e: status('data.birthdays.channel')
        },
        {
          c: 'birthdayrole',
          i: `${setting('data.birthdays.role', 'role')}`,
          d: 'Want members to be even more important on their birthday? You can do this by making a special role for them that they get on their special day. If you like the sound of this, choose a role you and send it now.',
          s: 'Birthday Role',
          e: status('data.birthdays.role')
        }
      ];
    }

    let step = 0;

    function error(problem) {
      return channel.send(new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} ${problem}`)
        .setColor("#FF3E3E"))
    }

    channel.send(
      new Discord.MessageEmbed()
      .setColor(process.env['EMBED_COLOR'])
      .setAuthor(`${client.user.username} Setup Process`, client.user.displayAvatarURL())
      .setDescription(`Welcome to ${client.user.username}'s setup process. This makes it easier for you to customize ${client.user.username} to your liking, rather than having to type out long settings commands.\n\nWant to **skip** a **certain step** of the setup process? No problem, just **type \`skip\`** to move onto the **next step**!\n\nStarting to feel as though you **don't** really want to carry on with the **setup process**? No problem, just **type \`cancel\`**!\n\n**Missed out** a step or answered a step **incorrectly**? No problem, just **type \`back\`** to be taken back to the **previous** step!\n\nNow that you've been briefed on what to expect, let's get started on the setup process! We recommended doing this process in a **private channel** so that messages from other users don't interrupt you.\n\n> **Type \`start\` to begin**`)
      .setFooter(`Want to get straight into the commands? Type ${prefix}help for a list of commands`)

    )
    channel.awaitMessages(m => m.author.id === message.author.id, {

      max: 1,
      time: 180000

    }).then(async collected => {

      let input = collected.first().content.toLowerCase();

      if (input === 'start') {
        processManager();

      } else {
        error(`**${client.user.username} Setup Process** cancelled`);

      }

    }).catch(() => {
      error(`**${client.user.username} Setup Process** timed out due to no input from the user`);
    })

    async function processManager() {
      await lastestData();

      channel.send(
        new Discord.MessageEmbed()
        .setColor(process.env['EMBED_COLOR'])
        .setAuthor(`${client.user.username} Setup | ${steps[step].s}`, client.user.displayAvatarURL())
        .setDescription(`${steps[step].e} **${steps[step].s} is currently set to:** ${steps[step].i}`)
        .addField('\u200B', `${steps[step].d}\n\u200B`)
        .setFooter(`Type "skip" to leave this step out, type "cancel" to end the setup process and type "back" to go back to the previous step`)

      )
      channel.awaitMessages(m => m.author.id === message.author.id, {

        max: 1,
        time: 180000

      }).then(async collected => {

        let input = collected.first().content.toLowerCase();

        channel.send(new Discord.MessageEmbed().setDescription(loadingEmoji)).then(async msg => {

          if (input === 'skip' || input === 'next') {
            setTimeout(async () => {
              msg.delete();

              if (step >= (steps.length - 1)) {
                current = fetchLatest(message.guild);

                return channel.send(
                  new Discord.MessageEmbed()
                  .setColor('GREEN')
                  .setAuthor(`${client.user.username} Setup Completed`, client.user.displayAvatarURL())
                  .setDescription(`${checkEmoji} **${client.user.username} is now ready to function in your server!**\n\n**Extra features to enhance your server:**\n\n\`${current.prefix}settings levelroles\`\n\`${current.prefix}settings actions\`\n\nTry out \`${current.prefix}settings\` for more customizable options`)
                )
              }

              step++;
              processManager();

            }, 500);

          } else if (input === 'back' || input === 'previous') {
            setTimeout(async () => {
              msg.delete();

              if (step > 0) step--;
              processManager();

            }, 500);

          } else if (input === 'cancel' || input === 'end') {

            setTimeout(async () => {
              msg.delete();
              error(`**${client.user.username} Setup Process** ended by user`);

            }, 500);

          } else {
            current = fetchLatest(message.guild);
            
            let currentSettings = current;
            let setting = steps[step].c;
            let inputargs = `${setting} ${collected.first().content}`.split(/[ ]+/);
            let settinginfo = inputargs[1];

            await client.functions.get('settings').execute(collected.first(), inputargs, client, setting, settinginfo, currentSettings);

            setTimeout(async () => {
              msg.delete();

              if (step >= (steps.length - 1)) {
                return channel.send(
                  new Discord.MessageEmbed()
                  .setColor('GREEN')
                  .setAuthor(`${client.user.username} Setup Completed`, client.user.displayAvatarURL())
                  .setDescription(`${checkEmoji} **${client.user.username} is now ready to function in your server!**\n\n**Extra features to enhance your server:**\n\n\`${current.prefix}settings levelroles\`\n\`${current.prefix}settings actions\`\n\nTry out \`${current.prefix}settings\` for more customizable options`)
                )
              }


              step++;
              processManager();

            }, 500);

          }

        })
      }).catch(() => {
        error(`**${client.user.username} Setup Process** timed out due to no input from the user`);
      })
    }
  }
};