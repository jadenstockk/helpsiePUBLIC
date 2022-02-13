const Discord = require("discord.js");
const profanityfilter = require("./profanityfilter");
const warn = require("../moderation/warn");

module.exports = {
  name: "namefilter",
  description: "server nickname profanity filter",

  async execute(user, nickname, client, user1) {
    if (user1) {
      if (user1.user.username === nickname) return;
    }
    if (client.cache.has(user.user.id + nickname)) return;

    let filterStatus = client.settings.get(user.guild.id).profanityFilter;

    let filtered = await profanityfilter.filterprofanity(nickname, client);
    if (!filtered) return;

    let newNickname = nickname.toLowerCase();

    filtered.forEach(filter => {
      let stars = [];
      for (i in filter) {
        stars.push('*');
      }

      newNickname = newNickname.replace(filter, stars.join(''));

    })

    function removeNickname() {

      client.cache.add(user.user.id + newNickname);
      user.setNickname(newNickname);
  
      setTimeout(() => {
        client.cache.delete(user.user.id + newNickname);
        
      }, 500);

    }

    function warnUser() {

      warn.execute(client, 'Profanity in nickname', user, client.user, nickname, 'name', filtered.join(', '));

    }

    if (user.user.username === nickname && filterStatus !== 'off') return removeNickname();

    if (filterStatus === 'delete') {
      removeNickname();

    } else if (filterStatus === 'warndelete') {
      removeNickname();
      warnUser();

    } else if (filterStatus === 'warn') {
      warnUser();
      
    }
  },
};