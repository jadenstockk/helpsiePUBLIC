const errorhandler = require("../../errorhandler");
const serverlogs = require("../moderation/serverlogs");

module.exports = {
  name: "welcome",
  description: "server welcome message",

  execute(member, client) {
    const Discord = require("discord.js");
    const spacetime = require('spacetime');

    let created = spacetime(member.user.createdAt);
    let createdAt = spacetime.now().since(created).rounded;

    serverlogs.execute(member.guild, member.user, 'joined', null, null, createdAt, client);

    let settings = client.settings.get(member.guild.id).welcome;
    if (!settings.channel || !settings.message) return;

    let channel = client.channels.cache.get(settings.channel);
    if (!channel) return;

    channel.send(settings.message.replace('{user}', member.user).replace('{server}', member.guild.name)).catch(err => errorhandler.init(err, __filename));

    let role = member.guild.roles.cache.get(settings.role);
    if (!role) return;

    member.roles.add(role);
  },
};
