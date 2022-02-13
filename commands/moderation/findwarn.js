const warns = require("../../models/userData");
const Discord = require("discord.js");
const spacetime = require("spacetime");
const errorhandler = require("../../errorhandler");

module.exports = {
  commands: 'findwarn',
  modRequired: true,
  permissionError: `You aren't allowed to use this command`,
  permissionMessage: true,
  description: `Use this command to find a certain member's warn by using it's id`,
  usage: `<warn id>`,
  group: 'moderation',

  callback: (message, args, client) => {
    let id = args[0];

    function getTime(time) {
      let warntime = spacetime(time);
      return spacetime.now().since(warntime);
    }

    warns.find({
        guild: message.guild.id
      },
      async (err, data) => {

        let noResults = new Discord.MessageEmbed()
          .setAuthor(`🔍 No results found for ${id}`)
          .setColor("FF3E3E")

        if (err) return errorhandler.init(err, __filename, message);
        if ((!data) || (data.length < 1)) return message.channel.send(noResults);

        let results = data.find(user => user.warns.find(warn => warn.id));

        if (!results) return message.channel.send(noResults);

        results = results.toObject();
        let user = results.user;
        let warn = results.warns.find(warn => warn.id === id);

        if (!warn) return message.channel.send(noResults);

        let warnsEmbed = new Discord.MessageEmbed()
          .setAuthor(`🔍 Results found for ${id}`)
          .setDescription(`**User:** ${client.users.cache.get(user)}\n**Reason:** ${warn.reason}\n**Time:** ${getTime(warn.time).rounded}\n**Moderator:** ${client.users.cache.get(warn.moderator)}`)
          .setColor("FFC24F")

        message.channel.send(warnsEmbed).then(async msg => {

          await msg.react(trashEmoji);

          msg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === trashEmoji)), {
            max: 1,
            time: 120000
          }).then(async sendCollected => {

            if (sendCollected.first().emoji === trashEmoji) {

              msg.reactions.removeAll();

              results.warns.splice(results.warns.indexOf(warn), 1);
              await results.save();

              msg.edit(warnsEmbed.setColor("FF3E3E").setFooter(`Succesfully deleted warn`, `https://cdn.discordapp.com/emojis/817888791733600286.png?v=1`));

            }

          }).catch(() => {
            msg.reactions.removeAll();

          });
        })
      }
    );
  },
};