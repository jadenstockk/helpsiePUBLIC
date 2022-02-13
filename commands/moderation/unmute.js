const mute = require("../../functions/moderation/mute");

module.exports = {
  commands: 'unmute',
  modRequired: true,
  permissionError: `You aren't allowed to unmute people`,
  permissionMessage: true,
  botPermissions: ['MANAGE_ROLES'],
  group: 'moderation',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    let settings = client.settings.get(message.guild.id);

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return;

    mute.unmute(target, target.guild, message.author, client, message);
  }
};
