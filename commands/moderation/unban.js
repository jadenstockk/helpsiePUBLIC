const { unban } = require("../../functions/moderation/actions");

module.exports = {
  commands: 'unban',
  permissions: 'BAN_MEMBERS',
  permissionError: `You aren't allowed to unban members`,
  permissionMessage: true,
  botPermissions: ['BAN_MEMBERS'],
  group: 'moderation',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    if (message.author.bot) return;

    unban(args[0], message.guild, message.author, client, message);
  },
};