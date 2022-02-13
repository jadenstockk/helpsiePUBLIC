const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
    init: (client) => {
        
        client.on('messageUpdate', (oldMessage, newMessage) => {
          try {

            let author = newMessage.author;
            
            if (!author || !author.bot)
            if (oldMessage.member) author = client.users.cache.get(oldMessage.member.id);
            else return;
            
            if (author.bot) return;

            const args = newMessage.content.split(/[ ]+/)
    
            if (newMessage.channel.type === 'dm') {
              client.functions.get('dms').execute(newMessage, args, client);
            
            } else {
              client.functions.get('filtermanager').execute(newMessage, args, client);
            }
  
        } catch(err) {
          errHandler.init(err, __filename);

        }
        })
    }
}