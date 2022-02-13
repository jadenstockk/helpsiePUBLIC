module.exports = {
  commands: 'slowmode',
  permissions: 'MANAGE_CHANNELS',
  modRequired: true,
  permissionError: `You aren't allowed to set slowmode`,
  permissionMessage: true,
  botPermissions: ['MANAGE_CHANNELS'],
  group: 'moderation',

  callback: (message, args, client) => {
      let slowmodeAmount = args[0];

      message.delete();

      if (!slowmodeAmount) return;
      if (slowmodeAmount === "off") slowmodeAmount = 0;
      if (isNaN(slowmodeAmount)) return;
      if (slowmodeAmount > 21599) slowmodeAmount = 21600;

      message.channel.setRateLimitPerUser(slowmodeAmount);
    }
};
