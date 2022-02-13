const checkbirthdays = require("../../functions/other/checkbirthdays");

module.exports = {
  commands: 'removebirthday',
  description: `Use this command to remove your birthday`,
  usage: ``,
  group: 'birthdays',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const spacetime = require('spacetime');
    const userData = require('../../models/userData');

    userData.findOne({
        user: message.author.id,
        guild: message.guild.id
      },
      async (err, data) => {
        if (err) console.log(err);

        if (!data || !data.bDate) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} Your birthday hasn't been added yet`)
          .setColor("#FF3E3E")
        )

        data.bDate = null;
        data.bWished = [];
        checkbirthdays.removeRoleCounter(message.guild, message.member, message.author, client);
        await data.save();

        message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${checkEmoji} Successfully removed your birthday`)
          .setColor("#00FF7F")
        )
      }
    );
  }
};