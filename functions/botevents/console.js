const Discord = require('discord.js');
const config = require('../../config.json');
const consoleLogs = new Discord.WebhookClient(config.consoleLogsID, config.consoleLogsTOKEN);

module.exports = {

    /**
     * 
     * @param {*} message 
     * @param {*} type 
     * @param {Discord.Client} client 
    */
    
    log: async (message, type) => {

        if (type === 'success') emoji = '🟢 ';
        if (type === 'unsuccess') emoji = '🔴 ';
        if (!type) emoji = '';

        let clientType = '';
        if (process.env['TOKEN'] === process.env['BETA_TOKEN']) clientType = ' - BETA';

        consoleLogs.send(`\`${emoji}${message}${clientType}\``)
    }
}