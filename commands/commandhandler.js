const Discord = require('discord.js');
const errHandler = require('../errorhandler');
const errchecker = require('../functions/moderation/checkforerrors');
const tip = require('../functions/other/tip');

const validPermissions = [
  'CREATE_INSTANT_INVITE',
  'KICK_MEMBERS',
  'BAN_MEMBERS',
  'ADMINISTRATOR',
  'MANAGE_CHANNELS',
  'MANAGE_GUILD',
  'ADD_REACTIONS',
  'VIEW_AUDIT_LOG',
  'PRIORITY_SPEAKER',
  'STREAM',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'USE_EXTERNAL_EMOJIS',
  'VIEW_GUILD_INSIGHTS',
  'CONNECT',
  'SPEAK',
  'MUTE_MEMBERS',
  'DEAFEN_MEMBERS',
  'MOVE_MEMBERS',
  'USE_VAD',
  'CHANGE_NICKNAME',
  'MANAGE_NICKNAMES',
  'MANAGE_ROLES',
  'MANAGE_WEBHOOKS',
  'MANAGE_EMOJIS',
]

/**
 * 
 * @param {Discord.Client} client 
 * @param {*} commandOptions 
 */

module.exports = (client, commandOptions, disbut) => {

  let {
    commands,
    permissionError = `You aren't allowed to use this command.`,
    permissionMessage = true,
    modRequired = false,
    permissions = [],
    botPermissions = [],
    requiredRoles = [],
    group,
    callback,
  } = commandOptions

  if (typeof commands === 'string') {
    commands = [commands];
  }

  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }
  }

  if (botPermissions) {
    if (typeof botPermissions === 'string') {
      botPermissions = [botPermissions];
    }
    botPermissions.push('SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS');
  }

  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
    if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return;

    try {

      const {
        member,
        content,
        guild
      } = message

      let prefix;
      if (process.env['PREFIX']) prefix = process.env['PREFIX'];
      else prefix = client.settings.get(guild.id).prefix;

      if (!prefix) await client.database.fetchGuildData(guild.id, client), prefix = client.settings.get(guild.id).prefix;
      if (!prefix) prefix = '!';

      const disabled = client.settings.get(guild.id).disabled;
      const clientMember = message.guild.me;

      for (const alias of commands) {
        const command = `${prefix}${alias.toLowerCase()}`;
        const command2 = `<@!${client.user.id}> ${alias.toLowerCase()}`;

        if (
          content.toLowerCase().startsWith(`${command} `) ||
          content.toLowerCase() === command ||
          content.toLowerCase().startsWith(`${command2} `) ||
          content.toLowerCase() === command2

        ) {
          let commandDisabled = client.disabledCommands.find(disable => disable.command === alias);
          if (commandDisabled) return message.channel.send(new Discord.MessageEmbed().setDescription(`${logo} This command has been disabled by the ${client.user.username} Team\n**Reason:** ${commandDisabled.reason}`).setColor("#FF3E3E"));
        
          if (disabled.includes(group)) return;
          for (var i in disabled) {
            if (commands.includes(disabled[i])) return;
          }
        
          for (const permission of permissions) {
            if (!member.hasPermission(permission)) {
              if (permissionMessage) {
                let embed = new Discord.MessageEmbed()
                  .setDescription(`${nopeEmoji} ${permissionError}`)
                  .setColor("#FF3E3E")
        
                message.channel.send(embed)
              }
              return;
            }
          }
        
          for (const permission of botPermissions) {
            if (!clientMember.hasPermission(permission)) {
              if (permissionMessage) {
        
                let missingPermissions = [];
                for (const permission of botPermissions) {
                  if (!clientMember.hasPermission(permission)) {
        
                    let permissionFormatted = (permission.toLowerCase().charAt(0).toUpperCase() + permission.toLowerCase().slice(1)).replace('_', ' ').replace('_', ' ').replace('_', ' ');
                    let spaceCharacter = permissionFormatted.indexOf(' ');
                    if (spaceCharacter > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter + 1) + permissionFormatted.charAt(spaceCharacter + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter + 2, permissionFormatted.length)
        
                    let spaceCharacter2 = permissionFormatted.indexOf(' ', spaceCharacter + 1);
                    if (spaceCharacter2 > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter2 + 1) + permissionFormatted.charAt(spaceCharacter2 + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter2 + 2, permissionFormatted.length)
        
                    missingPermissions.push(`${permissionFormatted}`)
                  }
                }
        
                let checkErrors = errchecker(guild, false, missingPermissions.join(', '), false, client);
                if (checkErrors) return message.channel.send(checkErrors);
              }
            }
          }
        
          if (modRequired) {
            if (!member.roles.cache.get(modRole)) {
              if (!member.hasPermission('ADMINISTRATOR')) {
                if (permissionMessage) {
                  let embed = new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} ${permissionError}`)
                    .setColor("#FF3E3E")
        
                  message.channel.send(embed)
                }
                return;
              }
            }
          }
        
        
          for (const requiredRole of requiredRoles) {
            if (!member.roles.cache.some(role => role.name === requiredRole)) {
              if (permissionMessage) {
                message.channel.send(`${nopeEmoji} **${permissionError}**`)
              }
              return;
            }
          }

          tip('checksyntax', message, client);
        
          const args = content.split(/[ ]+/);
          args.shift();
          if (args[0] === alias) args.splice(0, 1);
        
          client.commandsRun = client.commandsRun + 1;
          callback(message, args, client, disbut);
        }
      }
    } catch (err) {
      errHandler.init(err, __filename, message);

    }
  })
}