module.exports = {
    commands: 'fetchdata',
  
    callback: (message, args, client) => {
      const Discord = require("discord.js");

      if (message.author.id === '541189322007904266') {
          let guild = client.guilds.cache.get(args[0]) || message.guild;

          message.channel.send(`\`🟢 Guild data for ${guild.name}:\`\n\n\`\`\`${require('util').inspect(client.settings.get(guild.id))}\`\`\``);
      }
    },
  };