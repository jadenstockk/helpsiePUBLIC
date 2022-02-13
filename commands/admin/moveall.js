module.exports = {
  commands: 'moveall',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  botPermissions: ['MOVE_MEMBERS'],
  permissionMessage: true,
  description: `Use this command to move all the members in the current voice channel you are in, to the voice channel of your choice`,
  usage: `<channel name or channel id>`,
  group: 'admin',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    if (message.member.voice.channel) {

      let moveChannel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name === args.slice(0).join(' ') && channel.type === 'voice')
      if (!moveChannel) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The voice channel you provided is invalid`).setColor("#FF3E3E"))
      if (moveChannel.id === message.member.voice.channel.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} You are already in this voice channel`).setColor("#FF3E3E"))

      let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
      let members = [];

      try {
        channel.members.forEach(member => {

          member.voice.setChannel(moveChannel);
          members.push(member.user.username)
        })

        message.channel.send(new Discord.MessageEmbed()
          .setDescription(`${checkEmoji} Moved **${members.length} members** from **${channel.name}** to **${moveChannel.name}**`)
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