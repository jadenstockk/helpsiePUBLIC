const Discord = require("discord.js");
const errorhandler = require("../../errorhandler");

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Discord.Role} roleCheck 
 * @param {*} missingPerms 
 * @param {*} neededPerms 
 * @param {Discord.Client} client 
 * @returns 
 */

module.exports = (guild, roleCheck, missingPerms, neededPerms, client) => {
    let me = guild.me;
    let outstandingPerms = [];
    let outstandingPermsFormatted = [];

    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'USE_EXTERNAL_EMOJIS',
        'USE_VAD',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]

    function embed(text1, text2) {
        if (me.hasPermission('EMBED_LINKS')) return new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} **${text1}**\n${text2}\n\n**Need help? Join our support server:**\nhttps://discord.gg/5jaZRYnZU5`)
            .setColor("FF3E3E")

        else return `${nopeEmoji} **${text1}**\n${text2}\n\n**Need help? Join our support server:**\nhttps://discord.gg/5jaZRYnZU5`
    }

    if (missingPerms)
        if (missingPerms.includes(", ")) permsDisplay = "permissions";
        else permsDisplay = "permission";
    if (missingPerms) return embed(`I am missing the \`${missingPerms}\` ${permsDisplay}`, `Go into the roles section in server settings, click on my role, and then click the switch next to the missing permission under the permissions section`);

    let highestRole = me.roles.highest;
    let position = highestRole.position;
    if (roleCheck)
        if (roleCheck.position > position) return embed(`My highest role is too low in the server's role hierarchy`, `Go into the roles section in server settings and drag my role up to or near the top`);

    if (neededPerms)
        neededPerms.forEach(perm => {
            if (!highestRole.permissions.has(perm)) outstandingPerms.push(perm);
        }),
        me.roles.cache.forEach(role => {
            if (roleCheck.position > role.position) return;

            outstandingPerms.forEach(perm => {
                if (role.permissions.has(perm)) return outstandingPerms.splice(outstandingPerms.indexOf(perm), 1);
                if (validPermissions.includes(perm) && (me.permissions.has(perm))) return outstandingPerms.splice(outstandingPerms.indexOf(perm), 1);
            })
        })

    if (outstandingPerms) {
        outstandingPerms.forEach(permission => {
            let permissionFormatted = (permission.toLowerCase().charAt(0).toUpperCase() + permission.toLowerCase().slice(1)).replace('_', ' ').replace('_', ' ').replace('_', ' ');
            let spaceCharacter = permissionFormatted.indexOf(' ');
            if (spaceCharacter > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter + 1) + permissionFormatted.charAt(spaceCharacter + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter + 2, permissionFormatted.length)

            let spaceCharacter2 = permissionFormatted.indexOf(' ', spaceCharacter + 1);
            if (spaceCharacter2 > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter2 + 1) + permissionFormatted.charAt(spaceCharacter2 + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter2 + 2, permissionFormatted.length)

            outstandingPermsFormatted.push(`${permissionFormatted}`)
        })
        outstandingPerms = outstandingPermsFormatted.join(', ');
    }

    if (outstandingPerms.length > 0)
        if (outstandingPerms.includes(", ")) permsDisplay = "permissions";
        else permsDisplay = "permission"
    if (outstandingPerms.length > 0) return embed(`My highest role is missing the \`${outstandingPerms}\` ${permsDisplay}`, `Go into the roles section in server settings, click on my highest role, and then click the switch next to the missing permission under the permissions section`);

    return false;
}