const Discord = require("discord.js");
const path = require('path');
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const config = require('./config.json');
const fs = require("fs");
const guildData = require('./models/guildData');
const botInfo = require("./models/botInfo");
const mute = require("./functions/moderation/mute");
const dotenv = require('dotenv');
const shortNum = require('number-shortener');
const prettyBytes = require('pretty-bytes');
dotenv.config();
const {
  DiscordInteractions,
  ApplicationCommandOptionType
} = require("slash-commands");
const slash = require('slash-commands');
const {
  fetchAllGuildData
} = require("./database");
const checkbirthdays = require("./functions/other/checkbirthdays");
const errorhandler = require("./errorhandler");
const spacetime = require("spacetime");
const webhookManager = require("./functions/other/webhookManager");
const prettyMilliseconds = require("pretty-ms");
client.setMaxListeners(0);
client.cache = new Set();
client.database = require('./database');
const disbut = require('discord-buttons')(client);


const interaction = new DiscordInteractions({
  applicationId: config.appID,
  authToken: process.env['TOKEN'],
  publicKey: config.publicKey,
});

const command = {
  name: "ping",
  description: "Get the bot's current API and client latency as well as uptime",
};

async function slashCmds() {
  await interaction
    //.getApplicationCommands('794565558862479360')
    //.deleteApplicationCommand('826856166273056768', '794565558862479360')
    .createApplicationCommand(command, '794565558862479360')
    .then(console.log)
    .catch(console.error);
}

client.console = require("./functions/botevents/console");

client.levelingTimeouts = new Set();
client.dmTimeouts = new Set();
client.addxpTimeouts = new Set();
client.settings = new Map();
client.timeouts = new Map();
client.birthdaysWished = [];
client.commandsRun = 0;
client.votingSites = [{
  name: 'Top.gg',
  link: 'https://top.gg/bot/781293073052991569/vote',
  code: 'topgg'
}, {
  name: 'Discord Bot List',
  link: 'https://discordbotlist.com/bots/helpsie/upvote',
  code: 'dbl'
}, {
  name: 'Bots For Discord',
  link: 'https://botsfordiscord.com/bot/781293073052991569/vote',
  code: 'bfd'
}];

client.disabledCommands = [{
    command: 'twitch',
    reason: 'Not completed due to issues with the Twitch API'
  },
  {
    command: 'importlevels',
    reason: 'Still in the works! Hopefully coming soon :)'
  }
];

client.functions = new Discord.Collection();
const subdirectories = fs.readdirSync('./functions');
subdirectories.forEach(directory => {
  const funcFiles = fs.readdirSync(`./functions/${directory}`).filter(file => file.endsWith('.js'));

  for (const fcfile of funcFiles) {

    const fccommand = require(`./functions/${directory}/${fcfile}`);
    client.functions.set(fccommand.name, fccommand);
  }
})

function fetchLatestData(guild) {
  return client.settings.get(guild.id);
}

module.exports.fetchLatest = fetchLatestData;

client.once("ready", async () => {

  client.user.setPresence({
    activity: {
      name: process.env['ACTIVITYNAME'],
      type: 'LISTENING'
    }
  });

  global.nopeEmoji = client.emojis.cache.get('794858153694986271');
  global.muteEmoji = client.emojis.cache.get('794859653825691699');
  global.trashEmoji = client.emojis.cache.get('817888791733600286');
  global.loadingEmoji = client.emojis.cache.get('840515988067581975');
  global.enabledEmoji = client.emojis.cache.get('843212731066089472');
  global.disabledEmoji = client.emojis.cache.get('843212731196243999');
  global.neutral2Emoji = client.emojis.cache.get('843237936211165225');
  global.neutralEmoji = client.emojis.cache.get('843235204068147240');
  global.warnEmoji = `:warning:`;
  global.checkEmoji = client.emojis.cache.get('796336616494727205');
  global.logo = client.emojis.cache.get('794861368435408917');
  global.dataFetched = 0;

  fetchAllGuildData(client, true);

  loadAll();

  const loadEvents = async () => {
    if (process.env['TOKEN'] === process.env['BETA_TOKEN']) client.user.setStatus('idle');
  
    const readCommands = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for (const file of files) {
        eventRun = require(`./events/${file}`)
        eventRun.init(client);
      }
    }
    readCommands('events');
    mute.expireManager(client);
    checkbirthdays.expireManager(client);
    botFunctions();
    if (process.env['TOKEN'] !== process.env['BETA_TOKEN']) webhookManager.update(client);
    console.log(`Loaded events`);
  }
  
  const loadCommands = async () => {
    global.allCommands = [];
    global.allCommandInfos = [];

    let baseFile = 'commandhandler.js'
    let commandBase = require(`./commands/${baseFile}`)
    const readCommands = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, dir))
      for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
  
        if (stat.isDirectory()) {
          readCommands(path.join(dir, file))
        } else if (file !== baseFile) {
          const option = require(path.join(__dirname, dir, file));
          commandBase(client, option, disbut);
          allCommands.push(option.commands.toString());
        }
      }
    }
    readCommands('commands');
  
    console.log(`Loaded commands`)
  }

  client.loadCommands = loadCommands;
  client.loadEvents = loadEvents;

  function loadAll() {
    setTimeout(() => {
      if (dataFetched > (client.guilds.cache.size - 1)) {

        console.log(`Loaded guild data`)
        loadCommands();
        loadEvents();
        //let onlineMessage = ` Shard #${client.shard.ids} is online in ${client.guilds.cache.size} guilds `;

        allCommands = allCommands.toString();
        //console.clear(), console.log(`||${'-'.repeat(onlineMessage.length)}||\n||${onlineMessage}||\n||${'-'.repeat(onlineMessage.length)}||\n`) //, client.console.log(`All startup functions completed`, 'success', client);

        console.log(`\n[${spacetime.now(`Africa/Johannesburg`).time()} ${spacetime.now(`Africa/Johannesburg`).format('YYYY-MM-DD')}]: Shard #${client.shard.ids || 'Unknown'} is online in ${client.guilds.cache.size} guilds\nAPI Ping ${client.ws.ping}ms | Uptime ${prettyMilliseconds(client.uptime)} | Memory ${prettyBytes(process.memoryUsage().heapUsed)}\n`);

      } else {
        setTimeout(() => {
          loadAll();

        }, 1000);
      }
    }, 3000);
  }
});

client.on("error", console.error);
client.on("warn", console.warn);

//TESTING
client.on('message', async message => {

  if (message.author.bot) return;
  const args = message.content.split(/[ ]+/);

  const {
    channel,
    member
  } = message;

  let button = new disbut.MessageButton()
    .setStyle('red')
    .setLabel('Hello')
    .setID('hey')

  let button2 = new disbut.MessageButton()
    .setStyle('url')
    .setLabel('Contribution Page')
    .setURL('https://npmjs.com/discord-buttons')

  if (message.member.roles.cache.get('824641926832848916')) {
    if (message.content === '132') {
      message.channel.send('Hey, i am powered by https://npmjs.com/discord-buttons', {
        buttons: [
          button, button2
        ]
      });
    }
  }
})

async function botFunctions() {

  //BIRTHDAYS
  setInterval(() => {
    client.functions.get("checkbirthdays").execute(client);

  }, 60000);

  //TIME CHECKER
  setInterval(() => {
    console.log(`\n[${spacetime.now(`Africa/Johannesburg`).time()} ${spacetime.now(`Africa/Johannesburg`).format('YYYY-MM-DD')}]: Shard #${client.shard.ids || 'Unknown'} is online in ${client.guilds.cache.size} guilds\nAPI Ping ${client.ws.ping}ms | Uptime ${prettyMilliseconds(client.uptime)} | Memory ${prettyBytes(process.memoryUsage().heapUsed)}\n`);

  }, 60000 * 60);

  //PRESENCE RELOADER
  setInterval(async () => {

    client.user.setPresence({
      activity: {
        name: process.env['ACTIVITYNAME'],
        type: 'LISTENING'
      }
    });

  }, 60000 * 20);

  //PRESENCE UPDATER
  /*
  let currentPresence = 1;
  setInterval(async () => {
    let users = 0;

    await client.guilds.cache.forEach(guild => {
      users = users + guild.memberCount;
    })

    let presences = [
      {
        name: process.env['ACTIVITYNAME'],
        type: 'LISTENING'
      },
      {
        name: `over ${`${shortNum(users)}`.replace('+', '').replace('-', '')} users`,
        type: 'WATCHING'
      }
    ];

    let presence = presences[currentPresence];
    if (!presence) currentPresence = 0, presence = presences[currentPresence];

    client.user.setPresence({
      activity: {
        name: presence.name,
        type: presence.type
      }
    });
    currentPresence++
    
  }, 15000);
  */

  //STATS UPDATER
  setInterval(async () => {
    updateDatabaseStats();

  }, 60000 * 20);

  //STATS POSTER
  setInterval(async () => {
    if (process.env['TOKEN'] !== process.env['BETA_TOKEN']) webhookManager.update(manager);

  }, 30000 * 20);
}

async function updateDatabaseStats() {
  let commandsRun = client.commandsRun;
  let guilds = client.guilds.cache.size;

  botInfo.findOne({
      mainID: 1
    },
    async (err, data) => {
      if (err) return;

      if (!data) {
        let newData = new botInfo({
          mainID: 1,
          commandsRun: commandsRun,

        })
        await newData.save();

      } else {
        data.commandsRun = data.commandsRun + commandsRun;
        await data.save();

      }
      client.commandsRun = 0;
    }
  )
}

client.database.mongoose();
client.database.redis();
client.login(process.env['TOKEN']);