const Discord = require('discord.js');
const config = require('./config.json');
const errorLogs = new Discord.WebhookClient(config.errorID, config.errorTOKEN);
const path = require('path');

module.exports = {
    init: (err, file, message) => {
        console.log(err);
        let type = 'Public Version';
        let guild = "";
        if (process.env['TOKEN'] === process.env['BETA_TOKEN']) type = 'Beta Version';
        if (message) guild = ` • ${message.guild.id}`;

        errorLogs.send(new Discord.MessageEmbed().setTitle(`${nopeEmoji} There was an error at: ${path.basename(file)}`).setDescription(`\`\`\`${err.stack}\`\`\``).setColor("#FF3E3E").setFooter(`${type}${guild}`).setTimestamp());
        if (message) message.channel.send(new Discord.MessageEmbed().setDescription(`${nopeEmoji} It seems there was an error! Please contact support if this reoccurs`).setColor("#FF3E3E")).catch(err2 => {
            console.log(err)
        })
        if (message) console.log(`Error: ${path.basename(file)} in guild ${message.guild.id}`);
        else console.log(`Error: ${path.basename(file)}`);        
    }
}