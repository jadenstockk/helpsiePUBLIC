const checkforerrors = require("./checkforerrors");
const serverlogs = require("./serverlogs");

module.exports = {
  name: 'unban',
  description: 'when a user gets unbanned',

  async execute(guild, user, client) {
    if (checkforerrors(guild, false, false, ['VIEW_AUDIT_LOG'], client)) return;

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_BAN_REMOVE",
    });

    const banLog = fetchedLogs.entries.first();

    if (!banLog) return;

    const {
      executor,
      target
    } = banLog;

    if (executor === client.user) return;

    let reason = banLog.reason;
    if (!reason) reason = "Unspecified";

    if (target.id === user.id) {
      serverlogs.execute(guild, user, 'BAN', executor, reason, null, client);
    } else {
      serverlogs.execute(guild, user, 'BAN', executor, reason, null, client);
    }
  }
}