module.exports = {
  commands: 'lock',
  modRequired: true,
  permissionError: `You aren't allowed to lock channels`,
  permissionMessage: true,
  botPermissions: ['MANAGE_CHANNELS'],
  description: `Use this command to lock the channel you use the command in`,
  usage: ``,
  group: 'moderation',

  callback: (message, args, client) => {
      const Discord = require("discord.js");
  
      if (
        message.member.hasPermission("MANAGE_CHANNELS")
      ) {
         message.delete();
         message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });

         let lockEmbed = new Discord.MessageEmbed()
         .setAuthor(`🔒 Channel locked by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
         .setColor("#FF3E3E")

         message.channel.send(lockEmbed);
    }
    },
  };