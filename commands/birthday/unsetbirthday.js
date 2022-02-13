const checkbirthdays = require("../../functions/other/checkbirthdays");

module.exports = {
  commands: 'unsetbirthday',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to remove someone else's birthday`,
  usage: `<member>`,
  group: 'birthdays',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const spacetime = require('spacetime');
    const userData = require('../../models/userData');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please mention a valid member who's birthday you want to remove`)
      .setColor("#FF3E3E")
    )
    if (user.bot) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Unfortunately bots do not have birthdays`)
      .setColor("#FF3E3E")
    )

    userData.findOne({
        user: user.id,
        guild: message.guild.id
      },
      async (err, data) => {
        if (err) console.log(err);

        if (!data || !data.bDate) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} ${user}'s birthday hasn't been added yet`)
          .setColor("#FF3E3E")
        )

        data.bDate = null;
        data.bWished = [];
        checkbirthdays.removeRoleCounter(message.guild, message.guild.members.cache.get(user.id), user, client);
        await data.save();

        return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${checkEmoji} Successfully removed ${user}'s birthday`)
          .setColor("#00FF7F")
        )
      }
    );
  }
};