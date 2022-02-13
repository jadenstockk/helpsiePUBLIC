const Discord = require("discord.js");
const globalUserData = require("../../models/globalUserData");

module.exports = {
    commands: ['vote'],

    callback: async (message, args, client) => {
        let votes = 0;
        let data = await globalUserData.findOne({
            user: message.author.id
        });
        if (data && data.votes.length > 0) votes = data.votes.length;

        let inviteEmbed = new Discord.MessageEmbed()
            .setAuthor(`Vote for ${client.user.username}`, client.user.displayAvatarURL())
            .setDescription(`You currently have a total of **\`${votes} voting credits\`**`)
            .addField(`\u200B`, `**Voting Websites:**`)
            .setColor("#059DFF")

        let sites = client.votingSites;
        sites.forEach(site => {
            inviteEmbed.addField(`**${site.name}**`, `[\`Click here\`](${site.link})`, true);
        });

        message.channel.send(inviteEmbed);
    },
};