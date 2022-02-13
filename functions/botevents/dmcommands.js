const Discord = require("discord.js");
const globalUserData = require("../../models/globalUserData");
const userData = require("../../models/userData");

module.exports = {
    name: "dmcommands",
    description: "bot dm commands",

    async execute(message, args, client) {
        if (message.author.bot) return;
        const command = message.content.split(/[ +]/)[0];

        if (command === 'viewdata') {
            if (client.dmTimeouts.has(message.author.id)) return message.author.send("`❌ Try again in 5 minutes`")

            client.dmTimeouts.add(message.author.id);
            setTimeout(() => {
                client.dmTimeouts.delete(message.author.id);
                
            }, 300000);

            try {

                let data1 = await userData.find({
                    user: message.author.id

                })
                data1.forEach(doc => {
                    message.author.send('```' + require('util').inspect(doc) + '```').catch(err => err.stack);
                })

                let data2 = await globalUserData.find({
                    user: message.author.id

                })
                data2.forEach(doc => {
                    message.author.send('```' + require('util').inspect(doc) + '```').catch(err => err.stack);
                })

            } catch (err) {

            }
        }
    },
};