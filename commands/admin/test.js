const guildMemberAdd = require("../../events/guildMemberAdd");
const tip = require("../../functions/other/tip");

module.exports = {
  commands: 'test',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to simulate/test events that the bot handles such as when a member joins`,
  usage: `<event>`,
  group: 'admin',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    message.reply('hey :))))))');
  },
};