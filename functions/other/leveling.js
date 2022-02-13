const errorhandler = require("../../errorhandler");
const userData = require("../../models/userData");

module.exports = {
    name: 'leveling',
    description: 'increase member xp for sending messages',

    execute(message, args, client) {
        if (client.levelingTimeouts.has(`${message.author.id} | ${message.guild.id}`)) return;
        if (allCommands.includes(args[0].replace(client.settings.get(message.guild.id).prefix, '')) && message.content.startsWith(client.settings.get(message.guild.id).prefix)) return;
        if (client.blacklistedUsers && client.blacklistedUsers.find(person => person.user === message.author.id)) return;

        let max = 25;
        let min = 15;
        let randomXP = Math.floor(Math.random() * (max - min) + min);

        const settings = client.settings.get(message.guild.id).leveling;
        if (settings.ignoredChannels.includes(message.channel.id)) return;


        addXP(message.guild.id, message.author.id, randomXP, message, client, true);

        client.levelingTimeouts.add(`${message.author.id} | ${message.guild.id}`);

        setTimeout(() => {
            client.levelingTimeouts.delete(`${message.author.id} | ${message.guild.id}`);

        }, 60000);
    }
}

const addXP = async (guild, user, addedXP, message, client, auto) => {
    let addedMessages = 0;
    if (auto) addedMessages = 1;

    const result = await userData.findOneAndUpdate({
        guild,
        user,
    }, {
        guild,
        user,
        $inc: {
            xp: addedXP,
            totalxp: addedXP,
            messages: addedMessages,
        }
    }, {
        upsert: true,
        new: true,
    })

    let USER = message.guild.members.cache.get(user).user;

    let needed = getRequiredXP(result.level);

    if (result.xp >= needed) {
        while (result.xp >= needed) {
            ++result.level
            result.xp -= needed

            if (result.xp >= needed) {
                needed = getRequiredXP(result.level);
            }
        }

        result.save();

        let levelingSettings = client.settings.get(message.guild.id).leveling;
        if (!levelingSettings) return;

        let channel = message.guild.channels.cache.get(levelingSettings.channel);
        if (!channel) channel = message.channel;

        if (levelingSettings.message) channel.send(levelingSettings.message.replace('{level}', result.level).replace('{user}', USER));

        let levelroles = levelingSettings.roles;
        if (!levelroles || levelroles.length < 1) return;

        levelroles.sort(function (a, b) {
            return a.level - b.level
        });

        try {
            levelroles.forEach((levelrole, index) => {
                if (result.level >= levelrole.level) {
                    message.guild.members.cache.get(user).roles.add(levelrole.role);
                }
            })

        } catch (err) {
            errorhandler.init(err, __filename);

        }
    }
}

const removeXP = async (guild, user, addedXP, message, client) => {

    const result = await userData.findOneAndUpdate({
        guild,
        user,
    }, {
        guild,
        user,
        $inc: {
            xp: -addedXP,
            totalxp: -addedXP,
        }
    }, {
        upsert: true,
        new: true,
    })

    let USER = message.guild.members.cache.get(user).user;

    let needed = getRequiredXP(result.level);

    if (result.totalxp < 1) {

        result.totalxp = 0;
        result.xp = 0;
        result.level = 0;

        result.save();

    } else if (result.xp < 1) {

        while (result.xp < 1) {
            --result.level
            result.xp += needed

            if (result.xp < 1) {
                needed = getRequiredXP(result.level);
            }
        }

        result.save();

        let levelingSettings = client.settings.get(message.guild.id).leveling;
        if (!levelingSettings) return;

        let levelroles = levelingSettings.roles;
        if (!levelroles || levelroles.length < 1) return;

        levelroles.sort(function (a, b) {
            return a.level - b.level
        });

        try {
            levelroles.forEach((levelrole, index) => {
                if (result.level >= levelrole.level) {
                    message.guild.members.cache.get(user).roles.add(role.role);

                } else if (result.level < levelrole.level) {
                    message.guild.members.cache.get(user).roles.remove(levelrole.role);
                }
            })

        } catch (err) {
            errorhandler.init(err, __filename);

        }
    }
}

const resetXP = async (guild, user, message, client) => {
    const result = await userData.findOneAndUpdate({
        guild,
        user,
    }, {
        guild,
        user,
        totalxp: 0,
        level: 0,
        xp: 0,

    }, {
        upsert: true,
        new: true,
    })
}

function getRequiredXP(level) {

    requiredXP = 100;
    xpAdd = 55;

    for (var i = 0; i < level; i++) {
        requiredXP = requiredXP + xpAdd;
        xpAdd = xpAdd + 10;

    }
    return requiredXP;
}

function getLevel(xp) {

    requiredXP = 100;
    xpAdd = 55;

    for (var i = 0; i < xp; i++) {
        requiredXP = requiredXP - xpAdd;
        xpAdd = xpAdd + 10;

    }
    return requiredXP;
}

module.exports.addXP = addXP
module.exports.removeXP = removeXP
module.exports.resetXP = resetXP