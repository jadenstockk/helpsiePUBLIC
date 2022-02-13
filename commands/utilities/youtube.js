module.exports = {
  commands: ['youtube'],
  group: 'utilities',

  callback: async (message, args) => {

    const Discord = require("discord.js");
    const config = require("../../config.json");
    const search = require("youtube-search");
    const opts = {
      maxResults: 10,
      key: config.youtubeAPI,
      type: 'video'
    };

    let query = args.slice(0).join(' ');
    if (!query) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Please provide something to search \`e.g. !youtube cat videos\``)
      .setColor("#FF3E3E")
    )

    let results = await search(query, opts).catch(err => message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} Sorry! There was an error when searching for your video`)
      .setColor("#FF3E3E")
    ))

    if (!results || results.pageInfo.totalResults === 0) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} I couldn't find anything that matches your search`)
      .setColor("#FF3E3E")
    )

    if (results) {
      let youtubeResults = results.results;

      message.channel.send(youtubeResults[0].link);
    }
  }
};