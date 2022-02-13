module.exports = {
    commands: 'globalenable',
  
    callback: (message, args, client) => {
      const Discord = require("discord.js");

      if (message.author.id === '541189322007904266') {
          let command = args[0];
          if (!command) return;

          client.disabledCommands.pop({ command });
          message.channel.send(`**Enabled command:** \`${command}\``);
      }
    },
  };