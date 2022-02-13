const guildMemberAdd = require("../../events/guildMemberAdd");
const tip = require("../../functions/other/tip");

module.exports = {
  commands: 'simulate',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to simulate/test events that the bot handles such as when a member joins`,
  usage: `<event>`,
  group: 'admin',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    let events = [
      `\`memberjoin\` - when a member joins the server`
    ]

    function success(info) {
      message.channel.send(new Discord.MessageEmbed().setDescription(`${checkEmoji} Successfully ran simulation of event: \`${info}\``).setColor("#00FF7F"))
    }

    let embed = new Discord.MessageEmbed().setDescription(`**Choose one of the following events below to simulate:**\n\n${events.join('\n')}`).setColor(process.env['EMBED_COLOR']).setFooter(`Type "${client.settings.get(message.guild.id).prefix}simulate <event>" to simulate the event of your choice`)

    let event = args[0];
    if (!event) return message.channel.send(embed);

    event = event.toLowerCase();

    if (event === 'memberjoin') {
      let member = message.mentions.members.first() || message.member;
      guildMemberAdd.simulate(member, client);

      tip('simulatememberjoin', message, client);
      success(event);

    } else return message.channel.send(embed);
  },
};