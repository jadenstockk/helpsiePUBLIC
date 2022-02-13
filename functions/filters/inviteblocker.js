const Discord = require("discord.js");
const warnUser = require("../moderation/warn");

module.exports = {
  blockinvite: async (message, args, client) => {

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
        const { guild, member, content } = message
        
        code = content.split('discord.gg/')[0].slice(content).split(/[ ]+/)[0];

        if (content.includes('discord.gg/')) isOurInvite = await isInvite(guild, code)
        else return;
        
        if (!isOurInvite) return true;
  }
};