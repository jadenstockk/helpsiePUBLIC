const Discord = require("discord.js");

module.exports = {
  blocklink: async (message, args, client) => {

    const isInvite = async (guild, code) => {
      return await new Promise((resolve) => {
        guild.fetchInvites().then((invites) => {
          for (const invite of invites) {
            if (code === invite[0]) {
              resolve(true)
              return
            }
          }
  
          resolve(false)
        })
      })
    }
    
    const { guild, member, content } = message;
    const code = content.split('discord.gg/')[1];

    let isOurInvite = false;

    if (content.includes('discord.gg/')) isOurInvite = await isInvite(guild, code);
    if (isOurInvite) return;

    if (content.includes('http://')) type = 'http://';
    else if (content.includes('https://')) type = 'https://';
    else return;

    link = content.split(type)[1].split(/[ ]+/)[0];
    link = link.slice(0, link.indexOf('/'));

    if (link && (typeof link === 'string')) return true;
  }
};