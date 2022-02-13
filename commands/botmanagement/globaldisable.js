module.exports = {
    commands: 'globaldisable',
  
    callback: (message, args, client) => {
      const Discord = require("discord.js");

      if (message.author.id === '541189322007904266') {
          let command = args[0];
          if (!command) return;

          let reason = args.slice(1).join(' ');
          if (!reason) return;

          client.disabledCommands.push({ command, reason });
          message.channel.send(`**Disabled command:** \`${command}\`\n**Reason:** \`${reason}\``);
      }
    },
  };