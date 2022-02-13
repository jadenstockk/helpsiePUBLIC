const Discord = require("discord.js");
const update = require("./update");

module.exports = (input, current, message, args, info, client) => {
  let automodactions = current.autoModActions;
  let success;

  if (input === 'new') {
    if (automodactions.length >= current.limits.automodactions) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} You are only allowed a maximum of ${current.limits.automodactions} automod actions`)
      .setColor("#FF3E3E")
    )

    const settinginfos = message.content.toLowerCase().split(/[ ]+/);
    settinginfos.shift();
    settinginfos.shift();
    settinginfos.shift();

    let punishments = ['ban', 'mute', 'kick'];

    if ((!settinginfos) || (settinginfos.length < 1)) return message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Action Creator`, message.guild.iconURL()).setDescription(`To create a new Automod Action, use the command as follows:\n**${current.prefix}settings actions new \`<type>\` \`[optional mute duration]\` \`<warns>\` \`<time>\`**\n\n\`<type>\` members when they have \`<warns>\` warns or more in the last \`<time>\` minutes\n\n> \`<type>\` - this is the type of punishment (\`kick\`, \`ban\` or \`mute\`)\n> \`<warns>\` - this is the minimum amount of warns the user needs in order for them to be punished\n> \`<time>\` - this is the amount of time the minimum amount of warns applies in minutes *(e.g. if the time is 30 minutes, any warn over 30 minutes ago will not be counted when deciding on whether the member should be punished)*\n> \`[optional mute duration]\` - this part is only necessary if the type of punishment you choose is \`mute\` (it is the amount of time the member will be muted for in minutes)`).setColor("#059DFF"));

    let action = {
      type: settinginfos[0],
      muteduration: null,
      amount: settinginfos[1],
      time: settinginfos[2]
    }

    if (action.type === 'mute') action = {
      type: settinginfos[0],
      muteduration: settinginfos[1],
      amount: settinginfos[2],
      time: settinginfos[3]
    }

    if ((!action.type) || (!punishments.includes(action.type))) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please provide a valid action type: \`kick\`, \`ban\` or \`mute\``)
      .setColor("#FF3E3E")
    )

    else if ((action.muteduration !== null) && (isNaN(action.muteduration))) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please provide a valid mute duration`)
      .setColor("#FF3E3E")
    )

    else if ((!action.amount) || (isNaN(action.amount))) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please provide a valid amount of warns`)
      .setColor("#FF3E3E")
    )

    else if ((!action.time) || (isNaN(action.time))) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please provide a valid time (this value must be in minutes)`)
      .setColor("#FF3E3E")
    )

    if (automodactions.find(a => a.type === action.type && a.time === action.time && a.amount === action.amount && a.muteduration === action.muteduration)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} There is already an Automod Action identical to the one you've just created`).setColor("#FF3E3E"));

    let typeString = `**${action.type}** members`;
    if (action.muteduration !== null) typeString = `**${action.type}** members for **${action.muteduration} minutes**`;

    automodactions.push(action);

    success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Action added: ${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#00FF7F"));

    update(automodactions, info, input, message, client, success);


  } else if (input === 'delete') {
    if ((!automodactions) || (automodactions.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No automod actions have been created`).setColor("#FF3E3E").setFooter(`Type "${current.prefix}settings actions new" to create a new action`));
    let deleteNumber = args[2];
    let action = automodactions[deleteNumber - 1];

    if ((!deleteNumber) || (isNaN(deleteNumber) || (!action))) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please provide a valid action number`).setColor("#FF3E3E").setFooter(`Type "${current.prefix}settings actions" for a list of actions you've created`));

    let typeString = `**${action.type}** members`;
    if (action.muteduration !== null) typeString = `**${action.type}** members for **${action.muteduration} minutes**`;

    message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Actions`, message.guild.iconURL()).setDescription(`**${checkEmoji} Confirm / ${nopeEmoji} Deny delete action:**\n\n${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#FF3E3E"))
      .then(async msg => {

        await msg.react(checkEmoji);
        await msg.react(nopeEmoji);

        await msg.awaitReactions(((reaction, user) => user.id === message.author.id && (reaction.emoji === checkEmoji || reaction.emoji === nopeEmoji)), {
          max: 1,
          time: 120000
        }).then(sendCollected => {

          if (sendCollected.first().emoji === checkEmoji) {

            msg.delete();

            automodactions = automodactions.splice(automodactions.indexOf(action) - 1, 1);

            success = (new Discord.MessageEmbed().setDescription(`${checkEmoji} Action successfully deleted: ${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`).setColor("#00FF7F"));

            update(automodactions, info, message, client, success);

          } else {

            msg.edit(
              new Discord.MessageEmbed()
              .setDescription(`${nopeEmoji} Cancelled deleting of action`)
              .setColor("#FF3E3E")
            )
            msg.reactions.removeAll();
          }

        }).catch(() => {

          msg.edit(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} Cancelled deleting of action`)
            .setColor("#FF3E3E")
          )
          msg.reactions.removeAll();
        });
      })



  } else {
    if ((!automodactions) || (automodactions.length < 1)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} No automod actions have been created`).setColor("#FF3E3E").setFooter(`Type "${current.prefix}settings actions new" to create a new action`));

    let actionlist = [];

    automodactions.forEach((action, index) => {

      let typeString = `**${action.type}** members`;
      if (action.muteduration !== null) typeString = `**${action.type}** members for **${action.muteduration} minutes**`;

      actionlist.push(`\`${index + 1}.\` ${typeString} when they have **${action.amount} warns** or more in the last **${action.time} minutes**`);

    })

    message.channel.send(new Discord.MessageEmbed().setAuthor(`Automod Actions`, message.guild.iconURL()).setDescription(actionlist.join('\n\n')).setFooter(`Type "${current.prefix}settings actions new" to create a new action or "${current.prefix}settings actions delete <action number>" to delete an action on the list`).setColor("#059DFF"));
  }
}