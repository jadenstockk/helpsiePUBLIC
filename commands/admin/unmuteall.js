module.exports = {
  commands: 'unmuteall',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  botPermissions: ['MUTE_MEMBERS'],
  description: `Use this command to unmute all the members in the current voice channel you are in`,
  usage: ``,
  group: 'admin',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    if (message.member.voice.channel) {

      try {

        let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
        let members = [];

        channel.members.forEach(member => {
          if (member.voice.serverMute === false) return;
          member.voice.setMute(false);
          members.push(member.user.username);
        })

        if (members.length < 1) return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} There are no muted members in this voice channel`)
          .setColor("#FF3E3E")
        )

        message.channel.send(new Discord.MessageEmbed()
          .setDescription(`${checkEmoji} Unmuted **${members.length} members** in **${channel.name}**`)
          .setColor("#00FF7F")
        )

      } catch (err) {

      }

    } else {
      let embed = new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} You have to be in a voice channel to use this command`)
        .setColor("#FF3E3E")

      message.channel.send(embed);
    }
  },
};