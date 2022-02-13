const { kick } = require("../../functions/moderation/actions");

module.exports = {
  commands: 'kick',
  permissions: 'KICK_MEMBERS',
  permissionError: `You aren't allowed to kick members`,
  permissionMessage: true,
  botPermissions: ['KICK_MEMBERS'],
  description: `Use this command to kick members from the server`,
  usage: `<member>`,
  group: 'moderation',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} You didn't mention a valid member to kick`)
      .setColor("#FF3E3E")
      );

    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Unspecified';
    
    kick(user, message.guild, message.author, reason, client, message);
  },
};
