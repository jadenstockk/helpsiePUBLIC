module.exports = {
    commands: 'importlevels',
    permissions: 'ADMINISTRATOR',
    permissionError: `You have to be an administrator to use this command`,
    permissionMessage: true,
    description: ``,
    usage: ``,
    group: 'admin',

    callback: async (message, args, client) => {
        const Discord = require("discord.js");
        const mee6 = require('mee6-levels-api');

        let data = await mee6.getLeaderboard('721065682401493002');
        data.forEach((member, index) => {
            ranks.push(`${index}. Level: ${member.level} | Progress: ${member.xp.userXp}`)
        });
    },
};