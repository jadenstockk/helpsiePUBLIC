const Discord = require('discord.js');
const userData = require('../../models/userData');
const spacetime = require('spacetime');
const database = require('../../database');
const timestring = require('timestring');
const ms = require('ms');
const timetostring = require('@danm/timespent');
const { expire } = require("../../database");
const errorhandler = require("../../errorhandler");
const botInfo = require('../../models/botInfo');

module.exports = {
    name: 'checkbirthdays',
    description: 'wish them happy birthdayyy',

    async execute(client) {

        let now = spacetime.now();

        await userData.find({
                bDate: `${now.month() + 1}/${now.date()}`
            },
            async (err, data) => {
                if (err) console.log(err);
                if (!data) {
                    return;

                } else {
                    await data.forEach(async (member, index) => {
                        if (member.bWished.includes(`${now.year()}`)) return;

                        let user = client.users.cache.get(member.user);
                        let guild = client.guilds.cache.get(member.guild);
                        if (!guild) return;
                        let guildmember = guild.members.cache.get(member.user)
                        let settings = client.settings.get(member.guild).birthdays;
                        let channel = settings.channel;
                        let message = settings.message;
                        if (!settings || !channel || !message) return;

                        channel = client.channels.cache.get(channel);
                        if (!channel) return;

                        channel.send(
                            user,

                            new Discord.MessageEmbed()
                            .setAuthor(`Happy Birthday ${user.tag}`, user.displayAvatarURL())
                            .setDescription(message.replace('{user}', user))
                            .setColor('BLUE')
                        )

                        member.bWished.push(`${now.year()}`);
                        await member.save();

                        setTimeout(() => {
                            if (!client.birthdaysWished.includes(`${client.birthdaysWished}-${now.year()}`)) {
                                client.birthdaysWished.push(`${client.birthdaysWished}-${now.year()}`);
                                user.send(
                                    new Discord.MessageEmbed()
                                        .setDescription(`**Hey there ${user}!**\n\nWe wanted to wish you a very happy birthday and we hope that everyone makes you feel like the special person you are today! 🥳\n\n**Regards,**\n${logo} ${client.user.username} Support Team`)
                                        .setThumbnail('https://i.gifer.com/origin/1a/1af8d3b487b77085d5288814f151e1de.gif')
                                        .setColor('BLUE')
                                );
                            }
                            
                        }, index * 100);

                        function secondsUntilMidnight() {
                            var midnight = new Date();
                            midnight.setHours(24);
                            midnight.setMinutes(0);
                            midnight.setSeconds(0);
                            midnight.setMilliseconds(0);
                            return (midnight.getTime() - new Date().getTime()) / 1000;
                        }

                        const seconds = Math.floor(secondsUntilMidnight());

                        if (seconds < 5) return;

                        const role = guild.roles.cache.get(settings.role);
                        if (!role) return;

                        const redisClient = await database.redisClient;
                        try {
                            const redisKey = `birthday-${user.id}-${guild.id}`;

                            await redisClient.get(redisKey, async (err, result) => {

                                if (err) {
                                    errorhandler.init(err, __filename);

                                } else {

                                    guildmember.roles.add(role, 'Birthday role add');
                                    await redisClient.set(redisKey, 'true', 'EX', seconds);
                                }
                            });

                        } catch (err) {
                            errorhandler.init(err, __filename, message);
                        }
                    })
                }
            }
        );
    },
    expireManager: (client) => {
        expire(message => {
            if (!message.startsWith(`birthday-`)) return;
            const birthdayData = message.split('-');

            const memberID = birthdayData[1];
            const guildID = birthdayData[2];

            const guild = client.guilds.cache.get(guildID);
            if (!guild) return;

            const member = guild.members.cache.get(memberID);
            if (!member) return;

            const settings = client.settings.get(guild.id);

            const roleID = settings.birthdays.role;
            if (!roleID) return;

            const role = guild.roles.cache.get(roleID);
            if (!role) return;

            member.roles.remove(role, 'Birthday role remove');
        })
    },
    removeRoleCounter: async (guild, member, user, client) => {
        const settings = client.settings.get(guild.id).birthdays;
        
        let role;
        if (settings.role) role = guild.roles.cache.get(settings.role);

        const redisClient = await database.redisClient;
        try {
            const redisKey = `birthday-${user.id}-${guild.id}`;

            await redisClient.get(redisKey, async (err, result) => {

                if (err) {
                    errorhandler.init(err, __filename);

                } else {

                    if (role) member.roles.remove(role, 'Birthday role remove');
                    if (result) await redisClient.del(redisKey);
                }
            });

        } catch (err) {
            errorhandler.init(err, __filename, message);
        }
    }
}