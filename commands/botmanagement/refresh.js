const Discord = require("discord.js");

module.exports = {
  commands: 'refresh',

  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   * @param {Discord.Client} client 
   * @returns 
   */

  callback: async (message, args, client) => {
    const guildData = require('../../models/guildData');

    if (message.author.id === '541189322007904266') {
      let guild = args[0];
      if (!guild) return;

      let guildCache;
      await client.shard.broadcastEval(`this.guilds.cache.get(${guild})`);
      console.log(guildCache);
      guildCache.forEach(value => { if (value) guildCache = value });
      if (typeof guildCache === 'object') guildCache = undefined;
      if (!guildCache) guildInfo = [`\`Searched for:\``, `\`ID: ${guild}\``]
      else guildInfo = [`\`Searched for:\``, `\`ID: ${guild}\``, `\`Name: ${guildCache.name}\``]

      guildData.findOne({
          guild: guild
        },
        async (err, data) => {
          if (err) console.log(err);
          if (!data) {
            if (guildCache) {
              message.channel.send(`\`🔴 guild found in client guild cache but not in database\`\n\n${guildInfo.join('\n')}`)
              message.channel.send(`\`🟡 refreshing guild data...\`\n\n${guildInfo.join('\n')}`).then(async msg => {

                await client.shard.broadcastEval(`if (this.guilds.cache.get(${guild})) client.database.fetchGuildData(${guild}, this)`);
                msg.edit(`\`🟢 succesfully refreshed guild data\`\n\n${guildInfo.join('\n')}`)

              })

            } else {
              return message.channel.send(`\`🔴 guild not found in client guild cache nor database\`\n\n${guildInfo.join('\n')}`)

            }

          } else {
            if (!guildCache) {
              return message.channel.send(`\`🔴 guild found in database but not in client guild cache\`\n\n${guildInfo.join('\n')}`)

            } else {
              message.channel.send(`\`🟡 refreshing guild data...\`\n\n${guildInfo.join('\n')}`).then(async msg => {

                await client.shard.broadcastEval(`if (this.guilds.cache.get(${guild})) client.database.fetchGuildData(${guild}, this)`);
                msg.edit(`\`🟢 succesfully refreshed guild data\`\n\n${guildInfo.join('\n')}`);

              })
            }
          }
        }
      );
    }
  },
};