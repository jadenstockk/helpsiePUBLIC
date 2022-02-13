const Discord = require("discord.js");
const serverlogs = require("../moderation/serverlogs");
const errorhandler = require("../../errorhandler");

module.exports = {
    /**
     * 
     * @param {Discord.User} user 
     * @param {Discord.Guild} guild 
     * @param {Discord.GuildMember} moderator 
     * @param {*} reason 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @returns 
     */

    ban: async (user, guild, moderator, reason, client, message) => {

        let member;
        member = guild.members.cache.get(user.id);

        if (member) {
            if (member.hasPermission('ADMINISTRATOR'))
                if (message) return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} You aren't allowed to ban admins`)
                    .setColor("#FF3E3E")
                );
                else return;

            if (!member.bannable) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} I do not have permission to ban this member`)
                .setColor("#FF3E3E")
            );
        }

        let bannedMessage = new Discord.MessageEmbed()
            .setColor("FF3E3E")
            .setAuthor(
                `${user.tag} has been banned`,
                user.displayAvatarURL()
            )
            .setDescription(`**Reason:** ${reason}`)

        try {
            guild.members.ban(user.id, {
                reason
            });

        } catch (err) {
            errorhandler.init(err, __filename);

        } finally {
            if (message) message.channel.send(bannedMessage);
            serverlogs.execute(guild, user, "BAN", moderator, reason, null, client);

        }
    },
    unban: async (user, guild, moderator, client, message) => {

        guild.fetchBans().then((bans) => {
            if (bans.size == 0) return;
            let bUser = bans.find((b) => b.user.id === user);
            if (!bUser)
                if (message) return message.channel.send(
                    new Discord.MessageEmbed()
                    .setDescription(`${nopeEmoji} You didn't mention a valid user to unban`)
                    .setColor("#FF3E3E")
                );
                else return;

            let unbannedMessage = new Discord.MessageEmbed()
                .setColor("33FF5B")
                .setAuthor(
                    `${bUser.user.tag} has been unbanned`,
                    bUser.user.displayAvatarURL({
                        dynamic: true
                    })
                )

            try {
                guild.members.unban(bUser.user);

            } catch (err) {
                errorhandler.init(err, __filename);

            } finally {
                if (message) message.channel.send(unbannedMessage);
                serverlogs.execute(guild, bUser.user, "UNBAN", moderator, null, null, client);

            }
        })
    },
    kick: async (user, guild, moderator, reason, client, message) => {
        if (user.hasPermission('ADMINISTRATOR') && !user.user.bot)
            if (message) return message.channel.send(
                new Discord.MessageEmbed()
                .setDescription(`${nopeEmoji} You aren't allowed to kick admins`)
                .setColor("#FF3E3E")
            );
            else return;

        if (!user.kickable) return message.channel.send(
            new Discord.MessageEmbed()
            .setDescription(`${nopeEmoji} I do not have permission to kick this member`)
            .setColor("#FF3E3E")
        );

        let kickedMessage = new Discord.MessageEmbed()
            .setColor("FF3E3E")
            .setAuthor(
                `${user.user.tag} has been kicked`,
                user.user.displayAvatarURL()
            )
            .setDescription(`**Reason:** ${reason}`)

        try {
            user.kick(reason);

        } catch (err) {
            errorhandler.init(err, __filename);

        } finally {
            if (message) message.channel.send(kickedMessage);
            serverlogs.execute(guild, user.user, "KICK", moderator, reason, null, client);

        }
    }
}