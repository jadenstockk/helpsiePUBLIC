const Discord = require("discord.js");
const errorhandler = require("../../../errorhandler");
const guildData = require('../../../models/guildData');

module.exports = async (NEW, INFO, input, message, client, SUCCESS) => {

    function display(value, special) {

        if (value === 'off') value = false;

        try {
            if (value && special) {
                if (special === 'channel') value = message.guild.channels.cache.get(value);
                else if (special === 'channels') returnedValues = [], value.forEach(v => returnedValues.push(message.guild.channels.cache.get(v))), value = returnedValues.join(', ')
                else if (special === 'role') value = message.guild.roles.cache.get(value);
                else if (special === 'message' && value === 'off') value === '\`off\`';
                else if (special === 'on/off') return '\`on\`';

            } else if (value && !special) {
                value = `\`${value}\``;
            }

            if (!value && (!special)) value = 'off';
            else if (!value && special) return '\`off\`';

            return value;

        } catch (err) {
            errorhandler.init(err, __filename);
        }
    }

    await guildData.findOne({
            guild: message.guild.id
        },
        async (err, data) => {

            if (err) return errorhandler.init(err, __filename, message);

            if (!data) {
                data = new guildData({
                    guild: message.guild.id
                })
            }

            eval('data.' + INFO.eval + '= NEW');

            if (SUCCESS === 3) {

            } else if (SUCCESS) {
                message.channel.send(SUCCESS);

            } else {
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${checkEmoji} Successfully set ${INFO.name} to: ${display(input, INFO.type)}`)
                    .setColor("#00FF7F")
                )
            }

            await data.save();
            await client.database.fetchGuildData(message.guild.id, client);
        }
    )
}