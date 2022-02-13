const leveling = require("../../functions/other/leveling");

module.exports = {
  commands: 'resetxp',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to reset a certain member's xp (experience which increases your progress to the next level)`,
  usage: `<member>`,
  group: 'leveling',

  callback: async (message, args, client) => {
    const Discord = require("discord.js");

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} You user you provided is not valid`).setColor("#FF3E3E"));
    if (user.bot) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} ${user} is a bot, and unfortunately you can't reset bot's xp`).setColor("#FF3E3E"));

    await leveling.resetXP(message.guild.id, user.id, message, client);
    client.levelingTimeouts.delete(`${message.author.id} | ${message.guild.id}`)
    message.channel.send(new Discord.MessageEmbed().setDescription(`${checkEmoji} Succesfully reset ${user}'s xp`).setColor("#00FF7F"));
  },
};

function getRequiredXP(level) {

  requiredXP = 100;
  xpAdd = 55;

  for (var i = 0; i < level; i++) {
    requiredXP = requiredXP + xpAdd;
    xpAdd = xpAdd + 10;

  }
  return requiredXP;
}