const errorhandler = require("../../errorhandler");
const inviteblocker = require("./inviteblocker");
const linkblocker = require("./linkblocker");
const profanityfilter = require("../filters/profanityfilter");
const warn = require("../moderation/warn");

module.exports = {
  name: "filtermanager",
  description: "manage bot filters",

  async execute(message, args, client) {

    if (message.author.bot) return;
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    const settings = client.settings.get(message.guild.id);

    function handle(type, filtered) {
      let target = message.member;
      let moderator = client.user;

      if (settings.disabled.find(one => one.name && one.name === type && one.channel && one.channel === message.channel.id)) return false;

      if (type === 'profanity') filterStatus = settings.profanityFilter, reason = "Profanity usage", filtered = filtered.join(', ');
      if (type === 'invite') filterStatus = settings.inviteBlocker, reason = "Posted an invite";
      if (type === 'link') filterStatus = settings.inviteBlocker, reason = "Posted a link";

      if (filterStatus === 'off') return;

      if (filterStatus === 'delete') {
        message.delete();

      } else if (filterStatus === 'warndelete') {
        message.delete();
        warn.execute(client, reason, target, moderator, message, type, filtered);

      } else if (filterStatus === 'warn') {
        warn.execute(client, reason, target, moderator, message, type, filtered);

      }

    }

    try {
      if (settings.profanityFilter !== 'off') {
        let profanityFILTERED = await profanityfilter.filterprofanity(message.content, args, client)
        if (profanityFILTERED) return handle('profanity', profanityFILTERED);

      }
      
      if (settings.inviteBlocker !== 'off') {
        let inviteFILTERED = await inviteblocker.blockinvite(message, args, client);
        if (inviteFILTERED) return handle('invite', inviteFILTERED);

      }
      
      if (settings.linkBlocker !== 'off') {
        let linkFILTERED = await linkblocker.blocklink(message, args, client);
        if (linkFILTERED) return handle('link', linkFILTERED);
      }

    } catch (err) {
      errorhandler.init(err, __filename);
    }
  }
}