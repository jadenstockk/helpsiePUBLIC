const warns = require("../../models/userData");
const Discord = require("discord.js");
const spacetime = require("spacetime");
const errorhandler = require("../../errorhandler");

module.exports = {
  commands: 'warns',
  description: `Use this command to get a list of a particular member's warns`,
  usage: `[optional member] - leave out the optional part to view YOUR warns`,
  group: 'moderation',

  callback: (message, args, client) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    function getTime(time) {
      let warntime = spacetime(time);
      return spacetime.now().since(warntime);
    }

    warns.findOne(
      { guild: message.guild.id, user: member.user.id },
      async (err, data) => {

        let noInfractions = new Discord.MessageEmbed()
        .setAuthor(`${member.user.tag} has no warnings`, member.user.displayAvatarURL({ dynamic: true }))
        .setColor("FFC24F")

        if (err) return errorhandler.init(err, __filename, message);
        if ((!data) || (!data.warns) || (data.warns.length < 1)) return message.channel.send(noInfractions);

        let warnsList = []
        data.warns.forEach(async (warn, i) => {
          warnsList.push(`**${warn.reason}** ● ${getTime(warn.time).rounded}`);

        })

        let last24Hours = 0;
        data.warns.forEach((warn, i) => {
          let time = getTime(warn.time).diff;
          let hours = (time.hours) + (time.days * 24) + (time.minutes / 1440) + (time.seconds / 86400);
          if ((hours > 24) || (time.days > 1) || (time.years > 0) || (time.months > 0)) return;
          last24Hours++;

        })

        let last7Days = 0;
        data.warns.forEach((warn, i) => {
          let time = getTime(warn.time).diff;
          if ((time.days > 7) || (time.years > 0) || (time.months > 0)) return;
          last7Days++;

        })

        let totalwarns = warnsList.length;

        if (last7Days < 2) last7Days = `${last7Days} warn`;
        else last7Days = `${last7Days} warns`;

        if (last24Hours < 2) last24Hours = `${last24Hours} warn`;
        else last24Hours = `${last24Hours} warns`;

        if (totalwarns < 2) totalwarns = `${totalwarns} warn`;
        else totalwarns = `${totalwarns} warns`;

        let warnings10 = `**Warnings:**\n`;
        if (warnsList.length > 10) warnings10 = `**Latest 10 Warnings:**\n`;

        let warnsEmbed = new Discord.MessageEmbed()
          .setAuthor(
            `${member.user.tag}'s Warnings`,
            member.user.displayAvatarURL({ dynamic: true })
          )
          .setDescription(`**Total:** ${totalwarns}\n**Last 24 Hours:** ${last24Hours}\n**Last 7 Days:** ${last7Days}\n\n${warnings10}${warnsList.reverse().slice(0, 10).join('\n')}`)
          .setColor("FFC24F")

        message.channel.send(warnsEmbed);
      }
    );
  },
};
