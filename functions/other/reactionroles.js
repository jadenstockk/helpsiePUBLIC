const Discord = require('discord.js');
const checkforerrors = require('../moderation/checkforerrors');

module.exports = {
    /**
     * 
     * @param { Discord.MessageReaction } reaction
     * @param { Discord.User } user
     * @param { Discord.Client } client
     */

    add: (reaction, user, client) => {
        const reactionroles = client.settings.get(reaction.message.guild.id).reactionRoles;
        if (!reactionroles || reactionroles.length < 1) return;

        const member = reaction.message.guild.members.cache.get(user.id);

        const rr = reactionroles.find(r => (r.emoji.replace('<', '').replace('>', '').replace(':', '') === reaction.emoji.identifier || r.emoji === reaction.emoji.name) && r.message === reaction.message.id);
        if (!rr) return;

        const role = reaction.message.guild.roles.cache.get(rr.role);
        if (!role) return;

        if (!reaction.message.guild.me.hasPermission('MANAGE_ROLES')) return;
        if (checkforerrors(reaction.message.guild, role, false, false, client)) return;

        if (member.roles.cache.has(rr.role)) return;
        else {
            member.roles.add(rr.role);
        }
    },
    remove: (reaction, user, client) => {
        const reactionroles = client.settings.get(reaction.message.guild.id).reactionRoles;
        if (!reactionroles || reactionroles.length < 1) return;

        const member = reaction.message.guild.members.cache.get(user.id);

        const rr = reactionroles.find(r => (r.emoji.replace('<', '').replace('>', '').replace(':', '') === reaction.emoji.identifier || r.emoji === reaction.emoji.name) && r.message === reaction.message.id);
        if (!rr) return;

        const role = reaction.message.guild.roles.cache.get(rr.role);
        if (!role) return;

        if (!reaction.message.guild.me.hasPermission('MANAGE_ROLES')) return;
        if (checkforerrors(reaction.message.guild, role, false, false, client)) return;

        if (!member.roles.cache.has(rr.role)) return;
        else {
            member.roles.remove(rr.role);
        }
    }
}