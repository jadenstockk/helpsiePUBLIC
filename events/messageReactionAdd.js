const Discord = require('discord.js');
const errHandler = require('../errorhandler');
const checkforerrors = require('../functions/moderation/checkforerrors');
const reactionroles = require('../functions/other/reactionroles');

module.exports = {
    init: (client) => {

        client.on("messageReactionAdd", async (reaction, user) => {

            try {
                if (checkforerrors(reaction.message.guild, false, false, ['READ_MESSAGE_HISTORY'], client)) return;
                if (user.bot) return;
                if (reaction.message.partial) await reaction.message.fetch().catch(err => { return });
                if (reaction.partial) await reaction.fetch().catch(err => { return });
                if (!reaction.message.guild) return;

                reactionroles.add(reaction, user, client);

            } catch (err) {
                errHandler.init(err, __filename);

            }
        });
    }
}