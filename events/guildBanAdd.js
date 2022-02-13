const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
    init: (client) => {
        
        client.on("guildBanAdd", async (guild, user) => {
            try {
                client.functions.get("ban").execute(guild, user, client);

            } catch (err) {
                errHandler.init(err, __filename);

            }
        });
    }
}