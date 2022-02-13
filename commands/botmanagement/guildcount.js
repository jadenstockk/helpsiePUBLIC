module.exports = {
  commands: 'guildcount',

  callback: (message, args, client) => {
    const Discord = require("discord.js");

    if (message.author.id === '541189322007904266') {
      message.channel.send(`\`Helpsie is currently in ${client.guilds.cache.size} guilds\``)
    }
  },
};