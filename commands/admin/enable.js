module.exports = {
  commands: 'enable',
  permissions: 'ADMINISTRATOR',
  permissionError: `You have to be an administrator to use this command`,
  permissionMessage: true,
  description: `Use this command to enable certain commands or command groups that are currently disabled (command groups are groups of commands e.g. moderation)`,
  usage: `<command or command group>`,
  group: 'admin',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const guildData = require('../../models/guildData');

    let enableCommand = args[0];
    let disabled = client.settings.get(message.guild.id).disabled;

    if (disabled.includes(enableCommand)) {
      let success = new Discord.MessageEmbed()
        .setDescription(`${checkEmoji} Successfully enabled the command: \`${enableCommand}\``)
        .setColor("#00FF7F")

      guildData.findOne({
          guild: message.guild.id
        },
        async (err, data) => {
          if (err) console.log(err);
          if (!data) {

          } else {

            if (!data.disabled) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} \`${enableCommand}\` is already enabled`).setColor("#FF3E3E"))
            else if (!data.disabled.includes(enableCommand)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} \`${enableCommand}\` is already enabled`).setColor("#FF3E3E"))
            else commandIndex = data.disabled.indexOf(enableCommand), data.disabled.splice(commandIndex, 1)
            await data.save();

            message.channel.send(success);

            client.database.fetchGuildData(message.guild.id, client);

          }
        }
      );

    } else if (!allCommands.includes(enableCommand)) {
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} Could not find the command \`${enableCommand}\``)
        .setColor("#FF3E3E")
      )

    } else if (!enableCommand) {
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} You did not specify a command to enable`)
        .setColor("#FF3E3E")
      )

    } else {
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(`${nopeEmoji} The command: \`${enableCommand}\` is already enabled`)
        .setColor("#FF3E3E")
      )

    }
  },
};