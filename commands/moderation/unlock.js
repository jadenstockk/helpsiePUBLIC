module.exports = {
  commands: 'unlock',
  modRequired: true,
  permissionError: `You aren't allowed to unlock channels`,
  permissionMessage: true,
  botPermissions: ['MANAGE_CHANNELS'],
  description: `Use this command to unlock the channel you use the command in`,
  usage: ``,
  group: 'moderation',

  callback: (message, args, client) => {
      const Discord = require("discord.js");
  
      if (
        message.member.hasPermission("MANAGE_CHANNELS")
      ) {
         message.delete();

         message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: null });

         let lockEmbed = new Discord.MessageEmbed()
         .setAuthor(`🔓 Channel unlocked by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
         .setColor("GREEN")

         message.channel.send(lockEmbed);
    }
    },
  };