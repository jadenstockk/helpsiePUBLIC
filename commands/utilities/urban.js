module.exports = {
  commands: ['urban'],
  group: 'utilities',

  callback: (message, args) => {
    const Discord = require("discord.js");
    const urban = require('urban-dictionary');

    let definition = args.slice(0).join(" ");
    let entriesNumber = 0;

    if (!definition) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} You did not specify a term to search for`)
      .setColor("#FF3E3E")
    )

    urban.term(definition, (error, entries, tags, sounds) => {
      if (error) {
        let definitionEmbed = new Discord.MessageEmbed()
          .setAuthor(`Urban Dictionary Search:`, "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg")
          .addFields({
            name: "Word:",
            value: definition
          }, {
            name: "Definition:",
            error
          })
          .setColor("#059DFF")
          .setFooter(
            `Urban Dictionary • www.urbandictionary.com`,
            "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg"
          )

        message.channel.send(definitionEmbed);

      } else {
        let definitionEmbed = new Discord.MessageEmbed()
          .setAuthor(`Urban Dictionary Search:`, "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg")
          .addFields({
            name: "Word:",
            value: `${entries[entriesNumber].word} `
          }, {
            name: "Definition:",
            value: `${entries[entriesNumber].definition}`
          }, {
            name: "Example:",
            value: `${entries[entriesNumber].example} `
          }, {
            name: "👍",
            value: `${entries[entriesNumber].thumbs_up} `,
            inline: true
          }, {
            name: "👎",
            value: `${entries[entriesNumber].thumbs_down}`,
            inline: true
          }, {
            name: "Author:",
            value: `${entries[entriesNumber].author} `
          })
          .setColor("#059DFF")
          .setFooter(
            `Urban Dictionary • www.urbandictionary.com`,
            "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg"
          )

        message.channel.send(definitionEmbed);
      }
    });
  },
};