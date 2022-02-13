const Discord = require("discord.js");

module.exports = {
  commands: 'userinfo',
  group: 'utilities',

  callback: (message, args, client) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let roles = [];
    member.roles.cache.forEach(role => {
      roles.push(role)
    })
    roles.splice(roles.indexOf('@everyone'))
    if (roles.length < 1) roles.push('Member has no roles')

    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let createdAt = member.user.createdAt;
    let createdAtFormated = `${days[createdAt.getDay()]}, ${months[createdAt.getMonth()]} ${createdAt.getDate()}, ${createdAt.getFullYear()}`;
    let joinedAt = member.joinedAt;
    let joinedAtFormated = `${days[joinedAt.getDay()]}, ${months[joinedAt.getMonth()]} ${joinedAt.getDate()}, ${joinedAt.getFullYear()}`;
    let boosterSince = member.premiumSince;
    if (boosterSince) boosterSinceFormated = `${days[boosterSince.getDay()]}, ${months[boosterSince.getMonth()]} ${boosterSince.getDate()}, ${boosterSince.getFullYear()}`;
    let booster = '';

    roles.reverse();

    if (member.premiumSince) booster = `\n> **> Booster Since:**\n> ${boosterSinceFormated}`;

    let importantPermissions = [
      'KICK_MEMBERS',
      'BAN_MEMBERS',
      'ADMINISTRATOR',
      'MANAGE_CHANNELS',
      'MANAGE_GUILD',
      'MANAGE_MESSAGES',
      'MENTION_EVERYONE',
      'MUTE_MEMBERS',
      'DEAFEN_MEMBERS',
      'MOVE_MEMBERS',
      'MANAGE_NICKNAMES',
      'MANAGE_ROLES',
      'MANAGE_WEBHOOKS',
      'MANAGE_EMOJIS'
    ]

    let permissions = [];
    member.permissions.toArray().forEach(permission => {
      if (!importantPermissions.includes(permission)) return;

      let permissionFormatted = (permission.toLowerCase().charAt(0).toUpperCase() + permission.toLowerCase().slice(1)).replace('_', ' ').replace('_', ' ').replace('_', ' ');
      let spaceCharacter = permissionFormatted.indexOf(' ');
      if (spaceCharacter > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter + 1) + permissionFormatted.charAt(spaceCharacter + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter + 2, permissionFormatted.length)

      let spaceCharacter2 = permissionFormatted.indexOf(' ', spaceCharacter + 1);
      if (spaceCharacter2 > -1) permissionFormatted = permissionFormatted.slice(0, spaceCharacter2 + 1) + permissionFormatted.charAt(spaceCharacter2 + 1).toUpperCase() + permissionFormatted.slice(spaceCharacter2 + 2, permissionFormatted.length)

      permissions.push(permissionFormatted)
    })

    if (roles.length > 29) roles.splice(0, roles.length + 1, 'Too many roles to display')

    if (permissions.length > 0) importantPermissionsFormatted = [
      `> **Important Permissions:**`,
      `> ${permissions.join(', ')}${booster}`,
      `> ** **`
    ]
    else importantPermissionsFormatted = []

    let userInfo = new Discord.MessageEmbed()
      .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor("#059DFF")
      .setFooter(`User ID: ${member.user.id}`, member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setDescription(`
    > **Joined at:**
    > ${joinedAtFormated}
    > ** **
    > **Created at:**
    > ${createdAtFormated}
    > ** **
    > **Roles [${member.roles.cache.size - 1}]:**
    > ${roles.join(' ')}
    > ** **
    ${importantPermissionsFormatted.join('\n')}
    `)

    message.channel.send(userInfo);
  },
};