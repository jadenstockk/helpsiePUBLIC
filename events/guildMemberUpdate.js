const Discord = require('discord.js');
const errHandler = require('../errorhandler');

module.exports = {
  init: (client) => {

    client.on("guildMemberUpdate", async (user1, user2) => {
      try {
        client.functions.get("namefilter").execute(user2, user2.displayName, client, user1);

      } catch (err) {
        errHandler.init(err, __filename);

      }
    });
  }
}