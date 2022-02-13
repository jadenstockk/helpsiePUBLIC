const Discord = require('discord.js');
const database = require('../database');
const errHandler = require('../errorhandler');

async function memberJoin(member, client) {
    try {
        client.functions.get("welcome").execute(member, client);
        client.functions.get("namefilter").execute(member, member.user.username, client);

        const redisClient = database.redisClient;
        const redisKey = `muted-${member.id}-${member.guild.id}`;

        redisClient.get(redisKey, (err, result) => {
            if (err) return errHandler.init(err, __filename)

            if (result) {
                const roleID = client.settings.get(member.guild.id).muteRole;
                if (!roleID) return;

                const muteRole = member.guild.roles.cache.get(roleID);
                if (!muteRole) return;

                member.roles.add(muteRole, 'Muted member');
            }
        })

    } catch (err) {
        errHandler.init(err, __filename);

    }
}

module.exports = {
    init: (client) => {

        client.on("guildMemberAdd", async (member) => {
            memberJoin(member, client);
        });
    },

    simulate: (member, client) => {
        memberJoin(member, client);
    }
}