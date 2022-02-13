const errorhandler = require("../../errorhandler");

module.exports = {
  commands: ['clear', 'purge'],
  permissions: 'MANAGE_MESSAGES',
  modRequired: true,
  permissionError: `You aren't allowed to clear messages`,
  permissionMessage: true,
  botPermissions: ['MANAGE_MESSAGES'],
  description: `Use this command to clear (in other words delete) a certain number of messages in the channel you use the command in`,
  usage: `<number of messages>`,
  group: 'moderation',

  callback: async (message, args, client) => {
    const Discord = require("discord.js");

      let clearAmount = args[0];

      if (!clearAmount) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please specify an amount of messages to clear`).setColor("FF3E3E"))
      if (isNaN(clearAmount)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Please specify an amount of messages to clear`).setColor("FF3E3E"))
      if (clearAmount < 0) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Amount of messages must be more than 0`).setColor("FF3E3E"))
      if (clearAmount > 1000) return message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} The max amount of messages you can clear is 1000`).setColor("FF3E3E"))

      let membersDeleted = new Map();
      let membersDeletedFinal = [];
      let amountOfMessages = 0;
      
      let fetched = await message.channel.messages.fetch({limit: clearAmount})
      await fetched.forEach(msg => {
        messages = membersDeleted.get(msg.author.id);
        if (!messages) messages = 0;
        else messages = messages.messages;

        membersDeleted.set(msg.author.id, { name: msg.author.username, messages: messages + 1 })
        amountOfMessages++
    
      })

      try {
        await message.delete();

        await message.channel.bulkDelete(clearAmount);

        membersDeleted.forEach(value => {
          if (value.messages < 2) type = 'message';
          else type = 'messages';

          membersDeletedFinal.push(`**${value.name}**: ${value.messages} ${type}`)
        })

        if (amountOfMessages < 2) type = 'message';
        else type = 'messages';
  
        message.channel.send(
          new Discord.MessageEmbed()
          .setColor("#059DFF")
          .setDescription(`${checkEmoji} Cleared **${amountOfMessages}** ${type}\n\n${membersDeletedFinal.join('\n')}`)
          ).then(msg => { msg.delete({ timeout: 3000 })})

      } catch(err) {

        errorhandler.init(err, __filename)
        message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} Could not delete messages. Can't be over 2 weeks old`).setColor("FF3E3E"))

        return;

      }
    }
};
