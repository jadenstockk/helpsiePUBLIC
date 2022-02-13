module.exports = {
    commands: ['twitch'],
    group: 'utilities',

    callback: async (message, args, client) => {

        const Discord = require("discord.js");
        const config = require("../../config.json");

        /*
        const twitch = require("twitch-user-info");

        let query = args.slice(0).join(' ');
        if (!query) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} Please provide something to search \`e.g. !twitch pokimane\``)
            .setColor("#FF3E3E")
        )

        try {
            await twitch(query, data => {
                console.log(data);
            })
    
            if (!results || results.length === 0) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} I couldn't find anything that matches your search`)
                .setColor("#FF3E3E")
            )
    
            if (results) {
                message.channel.send(
                    results
                )
            }

        } catch {
            message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} Sorry! There was an error when searching Twitch for that channel`)
                .setColor("#FF3E3E")
            )

        }
        */

        /*

        let results = await twitchClient.helix.channels.getChannelInfo(query)
        
        console.log(results);

        const twitch = require("twitch");
        const twitchAuth = require("twitch-auth");

        const secret = config.twitchToken;
        const id = config.twitchID;
        const authProvider = new twitchAuth.ClientCredentialsAuthProvider(id, secret);
        const twitchClient = new twitch.ApiClient({ authProvider });
        */
    }
};