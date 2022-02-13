const Discord = require('discord.js');
const spacetime = require('spacetime');
const uniqid = require('uniqid');
const serverlogs = require('./serverlogs');
const userData = require('../../models/userData');
const mute = require('./mute');
const { ban, kick } = require('./actions');

module.exports = {
    
    async execute(client, reason, target, moderator, message, type, filtered) {

      if (target.user.bot)
      if (message) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You aren't allowed to warn bots`)
          .setColor("#FF3E3E")
      );
      else return;

      if (target.hasPermission('ADMINISTRATOR'))
      if (message) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You aren't allowed to warn admins`)
          .setColor("#FF3E3E")
      );
      else return;

      let settings = client.settings.get(target.guild.id).autoModActions;

      let ID = uniqid();
      let extra = { id: ID }
      if (type === 'profanity') displayType = 'PROFANITY', extra = { message: message, filtered: filtered, id: ID };
      else if (type === 'invite') displayType = 'INVITE LINK', extra = { message: message, filtered: filtered, id: ID };
      else if (type === 'link') displayType = 'LINK', extra = { message: message, filtered: filtered, id: ID };
      else if (type === 'name') displayType = 'NICKNAME', extra = { nickname: message, filtered: filtered, id: ID };
      else displayType = 'WARN';

      let warning = new Discord.MessageEmbed()
      .setColor("FFC24F")
      .setAuthor(`${target.user.tag} has been warned`, target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`**Reason:** ${reason}\n**Warn ID:** ${ID}`)

      if (type !== 'name') message.channel.send(warning);
      else target.user.send(
        new Discord.MessageEmbed()
        .setColor("FFC24F")
        .setDescription(`${warnEmoji} You have been warned for using an inappropriate nickname in **${target.guild.name}**`)
      )

      let warnFormatted = {
        reason: reason,
        moderator: moderator.id,
        time: spacetime.now(),
        id: ID
      }

      userData.findOne(
        { guild: target.guild.id, user: target.user.id },
        async (err, data) => {
          if (err) return;

          if (!data) {

            let newData = new userData({
              guild: target.guild.id,
              user: target.user.id,
              warns: [ warnFormatted ]
            })
            await newData.save();

          } else {

            if (!data.warns) data.warns = [ warnFormatted ];
            else data.warns.push(warnFormatted), checkForMute(data.warns);

            await data.save();
          }
        }
      )

      async function checkForMute(warns) {
        if (!settings) return;

        let recentWarnsROUGH = [];
        let resolved = false;

        settings.sort( function( a, b ){ return  b.amount - a.amount });

        settings.forEach(action => {
          if (resolved === true) return;

          warns.forEach(warn => {
            let timeDiff = spacetime(warn.time).diff(spacetime.now()).minutes;

            if (timeDiff > action.time) return;
            if (recentWarnsROUGH.includes(warn.id)) return;
            recentWarnsROUGH.push(warn.id);
          })

          let recentWarns = recentWarnsROUGH.length;
          
          if (recentWarns >= action.amount) {
            resolved = true;

            let typeOfAction = action.type;

            if (typeOfAction === 'mute') {
              mute.mute(target, target.guild, action.amount * 60, moderator, 'Automuted for too many warnings', client);
              
            } else if (typeOfAction === 'kick') {
              kick(target, target.guild, client.user, 'Autokicked for too many warnings', client);

            } else if (typeOfAction === 'ban') {
              ban(target.user, target.guild, client.user, 'Autobanned for too many warnings', client);

            }
          }
        })
      }

      serverlogs.execute(target.guild, target.user, displayType, moderator, reason, '', client, extra);
    }
}