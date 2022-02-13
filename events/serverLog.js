const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
    init: (client) => {
        
        global.serverLog = function (user, type, moderator, reason, time) {
            try {
                client.functions.get("serverlogs").execute(user, type, moderator, reason, time, client);

            } catch (err) {
                errHandler.init(err, __filename);

            }
          };
    }
}