const tip = require("../../functions/other/tip");

module.exports = {
  commands: 'upcomingbirthdays',
  description: `Use this command to set your birthday`,
  usage: `<date>`,
  group: 'birthdays',

  callback: async (message, args, client) => {
    const Discord = require("discord.js");
    const spacetime = require('spacetime');
    const userData = require('../../models/userData');

    let data = await userData.find({
      guild: message.guild.id
    });
    let birthdays = [];
    let birthdaysFormatted = [];

    data.forEach(member => {
      if (!member.bDate) return;

      let user = member.user;
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let birthday = spacetime(member.bDate);
      if (spacetime.now().since(birthday).precise.endsWith('ago')) return;
      let localDate = birthday.toLocalDate();

      let formatted = `${localDate.getDate()} ${months[localDate.getMonth()]} ${localDate.getFullYear()}`;

      let date = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0);

      birthdays.push({
        date,
        user,
        formatted
      });
    })

    birthdays.sort((a, b) => b.date - a.date);
    birthdays.reverse();

    for (var i = 0; i <= 9; i++) {
      let birthday = birthdays[i];

      if (birthday) {
        let user = client.users.cache.get(birthday.user);
        let bday = birthday.formatted;

        birthdaysFormatted.push(`${i + 1}. ${user}'s birthday on **${bday}**`);
      }
    }

    if (birthdays.length < 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No birthdays are coming up in ${spacetime.now().year()}`).setColor("#FF3E3E"))

    tip('birthday', message, client);
    message.channel.send(
      new Discord.MessageEmbed()
      .setAuthor(`🎂 Upcoming Birthdays in ${spacetime.now().year()}`)
      .setDescription(birthdaysFormatted.join('\n'))
      .setColor(process.env['EMBED_COLOR'])
    )
  }
};