const errorhandler = require("../../errorhandler");

module.exports = {
  commands: 'imgur',
  description: `Use this command to search for images on imgur`,
  usage: `<image>`,
  group: 'utilities',

  callback: async (message, args, client) => {
    const Discord = require("discord.js");
    const imgur = require('imgur');

    imgur.setAPIUrl('https://api.imgur.com/3/');

    const query = args.slice(0).join(' ');
    if (!query) return message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${nopeEmoji} You did not specify something to search for`)
      .setColor("#FF3E3E")
    )

    const optionalParams = {
      sort: 'top',
      dateRange: 'week',
      page: 1
    };
    await imgur.search(query, optionalParams)
      .then(async (json) => {
        async function findRandom() {
          let random = Math.floor(Math.random() * Object.keys(json).length);
          let post = json[random];
          let image = post.images[0];

          if (image.type.includes('video')) return await findRandom();
          let returnObject = {
            url: image.link,
            title: post.title
          }
          return returnObject;
        }
        let image = await findRandom();
        message.channel.send(
          new Discord.MessageEmbed()
          .setImage(image.url)
          .setAuthor(image.title)
          .setColor("#059DFF")
          .setFooter(
            `Imgur • www.imgur.com`,
            "https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco/n7gnwha4eq9ewjjtksrt"
          )
        )
      })
      .catch((err) => {
        return message.channel.send(
          new Discord.MessageEmbed()
          .setDescription(`${nopeEmoji} We couldn't find any images that match your search`)
          .setColor("#FF3E3E")
        )
      });
  }
};