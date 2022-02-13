const leveling = require("../../functions/other/leveling");

module.exports = {
  commands: 'addxp',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to add a certain amount of xp (experience which increases your progress to the next level) to a certain member`,
  usage: `<member> <amount of xp>`,
  group: 'leveling',

  callback: async (message, args, client) => {
    const Discord = require("discord.js");

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The user you provided is not valid`).setColor("#FF3E3E"));
    if (user.bot) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} ${user} is a bot, and unfortunately you can't add xp to bots`).setColor("#FF3E3E"));

    let xp = parseInt(args[1]);
    if (!xp || isNaN(xp)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please enter a valid amount of xp to add`).setColor("#FF3E3E"));
    if (xp > 1000000) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} You can't add more than 1 million xp to a member at once`).setColor("#FF3E3E"));
    if (client.addxpTimeouts.has(`${message.author.id} | ${message.guild.id}`)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} You have to wait 30 seconds after adding other 100k xp (this is for abuse reasons)`).setColor("#FF3E3E"));

    if (xp > 100000) {
      client.addxpTimeouts.add(`${message.author.id} | ${message.guild.id}`)

      setTimeout(() => {
        client.addxpTimeouts.delete(`${message.author.id} | ${message.guild.id}`)

      }, 30000);
    }

    await leveling.addXP(message.guild.id, user.id, xp, message, client);
    message.channel.send(new Discord.MessageEmbed().setDescription(`${checkEmoji} Succesfully added **${xp}** xp to ${user}`).setColor("#00FF7F"));
  }
};