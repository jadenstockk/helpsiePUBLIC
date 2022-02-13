const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    init: (client) => {

        client.on('clickButton', async (button) => {
            if (button.id.startsWith('settings')) {
                
            }
          });
    }
}