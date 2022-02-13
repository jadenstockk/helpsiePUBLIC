const mute = require("../../functions/moderation/mute");

module.exports = {
  commands: 'mute',
  modRequired: true,
  permissionError: `You aren't allowed to mute people`,
  permissionMessage: true,
  botPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
  description: `Use this command to mute a particular member and prevent them from sending messages in text channels`,
  usage: `<member> [optional duration] [optional reason] - you can leave either the duration, reason or both the duration and reason out`,
  group: 'moderation',

  callback: (message, args, client) => {
    const Discord = require("discord.js");
    const timestring = require('timestring');
    const ms = require('ms');
    const redis = require('../../database').redis;
    const timetostring = require('@danm/timespent');

    let settings = client.settings.get(message.guild.id);

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return new Discord.MessageEmbed()
    .setDescription(`${nopeEmoji} Please provide the user you want to mute`)
    .setColor("#FF3E3E")
    .setTimestamp()
    
    let time = args[1];
    if (!isNaN(time)) time = timestring(time + 's', 'seconds');
    else try { time = timestring(time, 'seconds')} catch(err) { time = undefined };
    if (!time) time = -1;
    let reason = args.slice(2).join(" ");
    if (isNaN(time) || time < 1) reason = args.slice(1).join(" "), time = -1;
    if (!reason) reason = "Unspecified";

    mute.mute(target, message.guild, time, message.author, reason, client, message);
  },
};
