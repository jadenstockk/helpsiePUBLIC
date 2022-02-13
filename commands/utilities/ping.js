module.exports = {
  commands: ['ping'],
  group: 'utilities',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const timeconverter = require("@danm/timespent");

    message.channel.send(new Discord.MessageEmbed()
    .setDescription(`\`Calculating Latency and Uptime...\``)).then(msg => {
      let ping = msg.createdTimestamp - message.createdTimestamp

      msg.edit(new Discord.MessageEmbed()
      .setAuthor(`${client.user.username} Latency and Uptime`, client.user.displayAvatarURL())
      .setDescription(`**Bot Ping:** \`${ping}ms\`\n**API Ping:** \`${client.ws.ping}ms\``)
      .setColor(process.env['EMBED_COLOR']))
    })
  },
};