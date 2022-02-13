const Discord = require('discord.js');
const sclient = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const config = {
    "JADEN": "541189322007904266",
    "PREFIX": "s!",
    "TOKEN": require('./config.json').supportToken,
    "SERVER_ID": "794565558862479360",
    "CHANNEL_ID": "829849095610957825",
    "READY_MESSAGE": "Support Bot is now online",
    "ACTIVITY_STATUS": "support dms",
    "SUGGESTIONS": "833018112345112628",
    "BUGS": "830413268651606016"
}

sclient.once("ready", async () => {

    console.log(config.READY_MESSAGE);
    sclient.user.setPresence({
        activity: {
            type: "LISTENING",
            name: config.ACTIVITY_STATUS
        },
        status: 'dnd'
    })

    sclient.block = false;
});

sclient.on("message", async (message) => {
    if (message.author.bot) return;

    try {
        if (message.channel.id === config.SUGGESTIONS) {
            if (message) {
                message.react('🔼'), message.react('🔽');
            }
        }

    } catch (err) {
        return;

    }

    if (message.channel.type === "dm") {
        if (sclient.block) return message.channel.send("❌ **`Support messages aren't being accepted right now`**");
        var args = message.content.split(" ").slice(0)
        var args = args.slice(0).join(" ")
        var BOT_ID = sclient.user.id
        var userID = message.author.id
        if (message.content.startsWith(config.PREFIX)) return;
        if (message.author.bot) return;
        message.channel.send("**`Your message was succesfully sent to staff!`** :incoming_envelope:");
        if (message.content.startsWith(config.PREFIX)) return
        if (args.length > 1024) return message.reply("**`Your message content too many characters (1024 Limit)`**");
        var embed = new Discord.MessageEmbed()
            .setColor("#ff6464")
            .setAuthor(`New Message from ${message.author.username}`, message.author.avatarURL())
            .setDescription(args)
            .setFooter(`${config.PREFIX}reply ${message.author.id}`)
            .setTimestamp()
        sclient.guilds.cache.get(config.SERVER_ID).channels.cache.get(config.CHANNEL_ID).send(embed);

    } else {
        if (!message.content.startsWith(config.PREFIX)) return;
        if (message.author.id !== config.JADEN) return;

        const args = message.content.split(/[ ]+/);
        const command = args[0].slice(config.PREFIX.length);
        args.shift();

        if (command === 'reply') {
            var Rargs = args.slice(1).join(' ');
            var userID = args[0];
            if (isNaN(userID)) return message.reply("This is not an ID! Make sure to you the user's ID!")
            var embed = new Discord.MessageEmbed()
                .setColor("#ff6464")
                .setAuthor(`New Message from ${sclient.user.username}`, sclient.user.displayAvatarURL())
                .setDescription(Rargs)
                .setFooter(message.author.username, message.author.displayAvatarURL())
            sclient.users.cache.get(userID).send(embed).catch(err => {
                return
            });
            if (message.author.bot) return;
            message.channel.send("**`Your message was sent!`** :incoming_envelope:");

        } else if (command === 'shutdown') {

            sclient.block = true;
            message.channel.send('🟢 `Success`')

        } else if (command === 'unshutdown') {

            sclient.block = false;
            message.channel.send('🟢 `Success`')

        } else if (command === 'approve') {

            let channel = await sclient.channels.cache.get(config.SUGGESTIONS);
            let msg = await channel.messages.fetch(args[0]);
            if (!msg) return;
            if (msg.partial) await msg.fetch().catch(err => {
                return console.log(err);
            });

            msg.author.send(new Discord.MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`Your Suggestion was Implemented`, msg.author.displayAvatarURL())
                .setDescription(`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n**Suggestion Information:**\n${msg.content}\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n[**Click here to jump to your suggestion**](https://discord.com/channels/${config.SERVER_ID}/${config.SUGGESTIONS}/${msg.id})\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`)
                .setFooter(`Your suggestion has been approved and will be added to the bot in the next patch update. Thanks for helping us improve Helpsie!`, `https://cdn.discordapp.com/emojis/796336616494727205.png?v=1`))

            msg.channel.send(new Discord.MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`${msg.author.tag}'s Suggestion was Implemented`, msg.author.displayAvatarURL())
                .setDescription(`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n**Suggestion Information:**\n${msg.content}\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`)
                .setFooter(`This suggestion has been approved and will be added to the bot in the next patch update`, `https://cdn.discordapp.com/emojis/796336616494727205.png?v=1`))

            msg.react(checkEmoji);

            message.channel.send('🟢 `Success`');

        } else if (command === 'fixed') {

            let channel = await sclient.channels.cache.get(config.BUGS);
            let msg = await channel.messages.fetch(args[0]);
            if (!msg) return;
            if (msg.partial) await msg.fetch().catch(err => {
                return console.log(err);
            });

            msg.author.send(new Discord.MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`Your Bug Report was Fixed`, msg.author.displayAvatarURL())
                .setDescription(`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n**Bug Report Information:**\n${msg.content}\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n[**Click here to jump to your bug report**](https://discord.com/channels/${config.SERVER_ID}/${config.BUGS}/${msg.id})\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`)
                .setFooter(`Your bug report has been fixed and will be added to the bot in the next patch update. Thanks for helping us improve Helpsie!`, `https://cdn.discordapp.com/emojis/796336616494727205.png?v=1`))

            msg.channel.send(new Discord.MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`${msg.author.tag}'s Bug Report was Fixed`, msg.author.displayAvatarURL())
                .setDescription(`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n**Bug Report Information:**\n${msg.content}\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n[**Click here to view the full bug report**](https://discord.com/channels/${config.SERVER_ID}/${config.BUGS}/${msg.id})\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`)
                .setFooter(`This bug has been fixed will be added to the bot in the next patch update`, `https://cdn.discordapp.com/emojis/796336616494727205.png?v=1`))

            msg.react(checkEmoji);

            message.channel.send('🟢 `Success`');
        }
    }
});

sclient.login(config.TOKEN);