module.exports = {
  commands: 'disabled',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to view a list of all the disabled commands in the server`,
  usage: ``,
  group: 'admin',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const guildData = require('../../models/guildData');

    let prefix = client.settings.get(message.guild.id).prefix;
    let disabled = client.settings.get(message.guild.id).disabled;

    let clear = args[0];

    if (clear === 'clear') {
      let success = new Discord.MessageEmbed()
        .setDescription(`${checkEmoji} Successfully enabled all commands`)
        .setColor("#00FF7F")

      guildData.findOne({
          guild: message.guild.id
        },
        async (err, data) => {
          if (err) console.log(err);
          if (!data) {

            client.database.fetchGuildData(message.guild.id, client);

          } else {

            if (!data.disabled) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} \`${disableCommand}\` is already disabled`).setColor("#FF3E3E"));
            else data.disabled = [];
            await data.save();

            message.channel.send(success);

            client.database.fetchGuildData(message.guild.id, client);

          }
        }
      );

    } else {
      let disabledList = [];

      if (disabled) disabled.forEach(command => {
        disabledList.push(`\`${command}\``)
      })

      if (disabled.length < 1) message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} There are no disabled commands on this server`)
        .setColor("#FF3E3E")
      )

      else message.channel.send(
        new Discord.MessageEmbed()
        .setTitle(`Disabled Commands:`)
        .setDescription(`${disabledList.join('\n')}`)
        .setColor("#FF3E3E")
        .setFooter(`Type "${prefix}disabled clear" to enable all disabled commands`)
      )
    }
  },
};