const leveling = require("../../functions/other/leveling");

module.exports = {
  commands: 'removexp',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to remove a certain amount of xp (experience which increases your progress to the next level) from a certain member`,
  usage: `<member> <amount of xp>`,
  group: 'leveling',

  callback: async (message, args, client) => {
    const Discord = require("discord.js");

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The user you provided is not valid`).setColor("#FF3E3E"));
    if (user.bot) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} ${user} is a bot, and unfortunately you can't remove xp from bots`).setColor("#FF3E3E"));

    let xp = parseInt(args[1]);
    if (!xp || isNaN(xp)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please enter a valid amount of xp to remove`).setColor("#FF3E3E"));
    if (xp > 1000000) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} You can't remove more than 1 million xp to a member at once`).setColor("#FF3E3E"));

    await leveling.removeXP(message.guild.id, user.id, xp, message, client);
    message.channel.send(new Discord.MessageEmbed().setDescription(`${checkEmoji} Succesfully removed **${xp}** xp from ${user}`).setColor("#00FF7F"));
  }
};