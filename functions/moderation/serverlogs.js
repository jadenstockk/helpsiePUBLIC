const errorhandler = require('../../errorhandler');

module.exports = {
    name: 'serverlogs',
    description: 'log server actions',

    execute(guild, user, type, moderator, reason, time, client, extra) {
      const Discord = require('discord.js');

      let serverLogsDetails = client.settings.get(guild.id).logsChannel;
      if (!serverLogsDetails) return;

      const serverLogs = new Discord.WebhookClient(serverLogsDetails.id, serverLogsDetails.token);
      if (!serverLogs) return;

      if (type === "WARN") (emoji = "❗"), (colour = "FFC24F"), (typeDisplay = "WARNED");
      else if (type === "PROFANITY") (emoji = "❗"), (colour = "FFC24F"), (typeDisplay = "WARNED");
      else if (type === "INVITE LINK" || type === "LINK") (emoji = "🔗"), (colour = "FFC24F"), (typeDisplay = "WARNED");
      else if (type === "NICKNAME") (emoji = "🗣"), (colour = "FFC24F"), (typeDisplay = "WARNED");
      else if (type === "LINK") (emoji = "🔗"), (colour = "FFC24F"), (typeDisplay = "WARNED");
      else if (type === "KICK") (emoji = "🔒"), (colour = "FF3E3E"), (typeDisplay = "KICKED");
      else if (type === "BAN") (emoji = "🔒"), (colour = "FF3E3E"), (typeDisplay = "BANNED");
      else if (type === "joined") (emoji = "📥"), (colour = "33FF5B"), (typeDisplay = "joined");
      else if (type === "left") (emoji = "📤"), (colour = "FF3E3E"), (typeDisplay = "left");
      else if (type === "UNBAN") (emoji = "🔓"), (colour = "33FF5B"), (typeDisplay = "UNBANED");
      else if (type === "MUTED") (emoji = "🔇"), (colour = "FFC24F"), (typeDisplay = "MUTED");
      else if (type === "UNMUTED") (emoji = "🔊"), (colour = "33FF5B"), (typeDisplay = "UNMUTED");

      let logsEmbed = new Discord.MessageEmbed()
      .setColor(colour)
      .setAuthor(`[${typeDisplay}] ${user.tag}`, user.displayAvatarURL({ dynamic: true }))

      
      if (type === "PROFANITY") logsEmbed
      .setDescription(`**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n**ID:** ${extra.id}\n\n**Message:** ${extra.message.content}\n**Filtered:** __${extra.filtered}__`)

      else if (type === "INVITE LINK" || type === "LINK") logsEmbed
      .setDescription(`**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n**ID:** ${extra.id}\n**Message:** ${extra.message.content}`)

      else if (type === "NICKNAME") logsEmbed
      .setDescription(`**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n**ID:** ${extra.id}\n\n**Nickname:** ${extra.nickname}\n**Filtered:** __${extra.filtered}__`)

      else if (type === "WARN") logsEmbed
      .setDescription(`**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n**ID:** ${extra.id}`)

      else if (type === "KICK" || type === "BAN") logsEmbed
      .setDescription(`**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}`)

      else if (type === "UNBAN") logsEmbed
      .setDescription(`**User:** ${user}\n**Moderator:** ${moderator}`)
      
      else if (type === "joined") logsEmbed
      .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
      .setColor(colour)
      .setDescription(`${emoji} ${user} **${type} the server**\n\n**Account Created:**\n${time}`)
      .setThumbnail(user.displayAvatarURL())

      else if (type === 'left') logsEmbed
      .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
      .setColor(colour)
      .setDescription(`${emoji} ${user} **${type} the server**`)
      .setThumbnail(user.displayAvatarURL())
      
      else if (type === "MUTED") logsEmbed.setDescription(`**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n**Duration:** ${time}`)
      
      else if (type === "UNMUTED") logsEmbed.setDescription(`**User:** ${user}\n**Moderator:** ${moderator}`)


      serverLogs.send({ embeds: [logsEmbed], username: `${client.user.username} Logs`, avatarURL: client.user.displayAvatarURL() }).catch(err => { return });
  }
}