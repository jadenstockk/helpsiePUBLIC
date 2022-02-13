const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
  init: (client) => {

    client.on('message', message => {
      try {

        if (message.author.bot) return;
        const args = message.content.split(/[ ]+/);

        if (message.channel.type === 'dm') {
          if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return;
          
          client.functions.get('dms').execute(message, args, client);
          client.functions.get('dmcommands').execute(message, args, client);

        } else {
          client.functions.get('filtermanager').execute(message, args, client);
          client.functions.get('leveling').execute(message, args, client);
        }

      } catch (err) {
        errHandler.init(err, __filename, message);

      }
    })
  }
}