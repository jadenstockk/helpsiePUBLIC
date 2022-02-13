const leveling = require("../../functions/other/leveling");

module.exports = {
  commands: 'rank',
  description: `Use this command to view your current level and progress to the next level as well as your ranking in the server`,
  usage: `[optional member] - leave the optional part out to view YOUR rank`,
  botPermissions: ['ATTACH_FILES'],
  group: 'leveling',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const canvacord = require("canvacord");
    const userData = require("../../models/userData");
    const path = require('path');

    let user = message.mentions.users.first() || message.author;
    if (user.bot) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} ${user} is a bot, and unfortunately bots can't be ranked`).setColor("#FF3E3E"))

    userData.findOne({
        guild: message.guild.id,
        user: user.id
      },
      async (err, data) => {
        if ((!data || !data.totalxp || data.totalxp < 1) && (user !== message.author)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} ${user} isn't ranked yet! Get them them to send a couple messages first and then try again`).setColor("#FF3E3E"))
        else if (!data || !data.totalxp || data.totalxp < 1) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} You aren't ranked yet! Send a couple messages first and then try again`).setColor("#FF3E3E"))
        else level = data.level, xp = data.xp;

        let rank = await userData.find({
          guild: message.guild.id
        }).sort({
          level: "desc"
        }).lean();
        rank = rank.findIndex(x => x.user === user.id) + 1;

        let rankcard = new canvacord.Rank()
          .setAvatar(user.displayAvatarURL({
            dynamic: false,
            format: 'png'
          }))
          .setCurrentXP(xp)
          .setRequiredXP(getRequiredXP(level))
          .setProgressBar("#48a5ff", "COLOR")
          .setUsername(user.username)
          .setDiscriminator(user.discriminator)
          .setLevel(level)
          .setRank(rank)
          .setCustomStatusColor("#48a5ff")
          .setBackground('IMAGE', path.join(__dirname, `../../storage/2.jpg`))

        rankcard.build()
          .then(data => {
            const attachment = new Discord.MessageAttachment(data, "RankCard.png");
            message.channel.send(attachment);
          });
      }
    )
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