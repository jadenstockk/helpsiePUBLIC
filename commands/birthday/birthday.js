const tip = require("../../functions/other/tip");

module.exports = {
  commands: 'birthday',
  description: `Use this command to set your birthday`,
  usage: `<date>`,
  group: 'birthdays',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const spacetime = require('spacetime');
    const userData = require('../../models/userData');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    if (user.bot) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Unfortunately bots do not have birthdays`)
      .setColor("#FF3E3E")
    )

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    userData.findOne({
        user: user.id,
        guild: message.guild.id
      },
      async (err, data) => {
        if (err) console.log(err);

        if (!data || !data.bDate) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} ${user}'s birthday has not been added yet`)
          .setColor("#FF3E3E")
        )

        let birthday = spacetime(data.bDate);
        if (spacetime.now().since(birthday).precise.endsWith('ago')) birthday = birthday.add(1, 'year');
        let localDate = birthday.toLocalDate();
        let now = spacetime.now().toLocalDate();

        if ((now.getDate() === localDate.getDate()) && (now.getMonth() === localDate.getMonth())) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`🎂 ${user}'s birthday is today!`)
          .setColor(process.env['EMBED_COLOR'])
        )

        tip('birthday', message, client);
        message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`🎂 ${user}'s next birthday is in **${spacetime.now().since(birthday).precise}** on **${localDate.getDate()} ${months[localDate.getMonth()]} ${localDate.getFullYear()}**`)
          .setColor(process.env['EMBED_COLOR'])
        )
      })
  }
}