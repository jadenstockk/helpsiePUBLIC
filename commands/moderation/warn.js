const warn = require("../../functions/moderation/warn");

module.exports = {
  commands: 'warn',
  modRequired: true,
  permissionError: `You aren't allowed to warn people`,
  permissionMessage: true,
  botPermissions: ['MANAGE_ROLES'],
  group: 'moderation',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} You didn't mention a valid member to warn`)
      .setColor("#FF3E3E")
      );

    let moderator = message.author;

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Unspecified";

    warn.execute(client, reason, target, moderator, message, 'WARN');
  },
};