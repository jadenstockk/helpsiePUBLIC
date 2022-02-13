const Discord = require("discord.js");
const checkforerrors = require("../moderation/checkforerrors");

/**
 * 
 * @param {*} event 
 * @param {Discord.Message} message 
 * @param {Discord.Client} client 
 * @returns 
 */

module.exports = async (event, message, client) => {

    const settings = client.settings.get(message.guild.id);
    const prefix = settings.prefix;
    if (!settings.tips) return;

    function tip(content, admin) {
        if (admin) if (!message.member.hasPermission('ADMINISTRATOR')) return;

        if (checkforerrors(message.guild, false, false, ['EMBED_LINKS'])) return message.channel.send(`💡 **Tip:** ${content}`);
        else return message.channel.send(new Discord.MessageEmbed().setDescription(`💡 **Tip:** ${content}`).setColor("FFDC2C").setFooter(`Type "${settings.prefix}settings tips off" to stop getting these tips`));
    }

    if (event === 'simulatememberjoin') {
        const welcome = settings.welcome;
        if (!welcome.channel && !welcome.message && !welcome.role) return tip(`Welcome settings have **not** yet been set up on this server. Type **\`${prefix}settings\`** and use the **arrows below the list** to navigate to the **welcome settings** and view the available customization options`, true);
        
    } else if (event === 'birthday') {
        const birthdays = settings.birthdays;
        if (!birthdays.channel && !birthdays.message && !birthdays.role) return tip(`Birthday settings have **not** yet been set up on this server. Type **\`${prefix}settings\`** and use the **arrows below the list** to navigate to the **birthday settings** and view the available customization options`, true);

    } else if (event === 'checksyntax') {
        found = false;

        if ((message.content.includes('<<') && message.content.includes('>>')) || (message.content.includes('< <') && message.content.includes('> >')) || (message.content.includes('[') && message.content.includes(']'))) {
            if (!found) await message.guild.channels.cache.forEach(channel => {
                if (message.content.includes(channel.id) && !found) {
                    return tip(`We noticed you **might** be typing out your commands **incorrectly**. When you have a look at the help menu for example, the things inside the **\`< >\`**'s **are required** in order for the command to **function properly**, and the things inside the **\`[ ]\`**'s **are optional** and **aren't necessary** for the command to function.\n\n**Example:** \`!mute <member> [optional mute duration] [optional reason]\` - you can just type out \`!mute @annoying-panda-71\` and the command will still work but "annoying-panda-71" will be muted until the end of time for no apparent reason.\n\nAlso make sure when you type out your commands that you type:\n${checkEmoji} **Correct: \`#my-cool-channel\`**\n${nopeEmoji} **Incorrect: \`<#my-cool-channel>\`**`, true);
                    found = true;
                }
            })
            if (!found) await message.guild.roles.cache.forEach(role => {
                if (message.content.includes(role.id) && !found) {
                    return tip(`We noticed you **might** be typing out your commands **incorrectly**. When you have a look at the help menu for example, the things inside the **\`< >\`**'s **are required** in order for the command to **function properly**, and the things inside the **\`[ ]\`**'s **are optional** and **aren't necessary** for the command to function.\n\n**Example:** \`!mute <member> [optional mute duration] [optional reason]\` - you can just type out \`!mute @annoying-panda-71\` and the command will still work but "annoying-panda-71" will be muted until the end of time for no apparent reason.\n\nAlso make sure when you type out your commands that you type:\n${checkEmoji} **Correct: \`#my-cool-channel\`**\n${nopeEmoji} **Incorrect: \`<#my-cool-channel>\`**`, true);
                    found = true;
                }
            })
        }
    }
};