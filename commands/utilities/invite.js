const Discord = require("discord.js");

module.exports = {
  commands: ['invite'],

  callback: (message, args, client) => {
    let inviteEmbed = new Discord.MessageEmbed()
      .setAuthor(`Want to have me on your server?`, client.user.displayAvatarURL())
      .setDescription(`[Click here](https://discord.com/api/oauth2/authorize?client_id=781293073052991569&permissions=1916267615&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=bot) to be taken to the Discord bot authorization page`)
      .setColor("#059DFF")

    message.channel.send(inviteEmbed);
  },
};