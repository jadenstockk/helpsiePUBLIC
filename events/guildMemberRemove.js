const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
    init: (client) => {
        
        client.on("guildMemberRemove", async (member) => {
            try {
                if (member.id === client.user.id) return;
                client.functions.get("leave").execute(member, client);

            } catch (err) {
                errHandler.init(err, __filename);

            }
          });
    }
}