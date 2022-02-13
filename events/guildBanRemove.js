const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
    init: (client) => {
        
        client.on("guildBanRemove", async (guild, user) => {
            try {
                client.functions.get("unban").execute(guild, user, client);

            } catch (err) {
                errHandler.init(err, __filename);

            }
          });  
    }
}