const checkforerrors = require("./checkforerrors");
const serverlogs = require("./serverlogs");

module.exports = {
  name: 'leave',
  description: 'member leaves server',

  async execute(member, client) {
    if (checkforerrors(member.guild, false, false, ['VIEW_AUDIT_LOG'], client)) return;

    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_KICK",
    });
    const kickLog = fetchedLogs.entries.first();

    function left() {
      serverlogs.execute(member.guild, member.user, 'left', null, null, null, client);
    }

    function kick(mod, reason) {
      serverlogs.execute(member.guild, member.user, 'KICK', mod, reason, null, client);
    }

    if (!kickLog) return left();

    const {
      executor,
      target
    } = kickLog;

    if (executor === client.user) return left();

    if (Date.now() - kickLog.createdTimestamp < 5000) {
      let reason = kickLog.reason;
      if (!reason) reason = "Unspecified";

      if (target.id === member.id) {
        kick(executor, reason);

      } else {
        kick('Unkown', 'Unknown');
      }
    }
    left();
  }
}