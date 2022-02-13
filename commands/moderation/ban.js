const Discord = require("discord.js");
const { ban } = require("../../functions/moderation/actions");

module.exports = {
  commands: 'ban',
  permissions: 'BAN_MEMBERS',
  permissionError: `You aren't allowed to ban members`,
  permissionMessage: true,
  botPermissions: ['BAN_MEMBERS'],
  description: `Use this command to ban members from the server`,
  usage: `<member>`,
  group: 'moderation',

  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   * @param {Discord.Client} client 
   * @returns 
   */

  callback: async (message, args, client) => {
    if (message.author.bot) return;

    let user;
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (member) {
      user = member.user;

    } else {
      user = await client.users.fetch(args[0]);

      if (!user) return message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} You didn't mention a valid user to ban`)
          .setColor("#FF3E3E")
      );
    }

    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'Unspecified';

    ban(user, message.guild, message.author, reason, client, message);
  },
};