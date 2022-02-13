const Discord = require('discord.js');
const spacetime = require('spacetime');
const beta = require('./beta');
const config = require('./config.json');
const {
  redis,
  mongoose
} = require('./database');
const botconsole = require('./functions/botevents/console');
const webhookManager = require('./functions/other/webhookManager');
const support = require('./support');

console.clear();
console.log(`\n[${spacetime.now(`Africa/Johannesburg`).time()} ${spacetime.now(`Africa/Johannesburg`).format('YYYY-MM-DD')}]: Starting launch process...\n`);

const manager = new Discord.ShardingManager("./main.js", {
  token: config.betaToken,
  totalShards: 'auto',
  respawn: true,
  mode: 'worker'
});


manager.on("shardCreate", async (shard) => {

  console.log(`\n[${spacetime.now(`Africa/Johannesburg`).time()} ${spacetime.now(`Africa/Johannesburg`).format('YYYY-MM-DD')}]: Launching shard #${shard.id}...\n`);

  shard.on('disconnect', () => {
    botconsole.log(`🔴 [${new Date().toString().split(" ", 5).join(" ")}] Shard #${shard.id} disconnected:\n${err.stack}`, false, manager.shards);
    shard.respawn();

  })

  shard.on('reconnecting', () => {
    botconsole.log(`🟠 [${new Date().toString().split(" ", 5).join(" ")}] Shard #${shard.id} reconnecting...`, false, manager);
    shard.respawn();

  })

  shard.on('spawn', () => {
    //botconsole.log(`🟢 [${new Date().toString().split(" ", 5).join(" ")}] Shard #${shard.id} is online`, false, manager);
  })

  shard.on('error', err => {
    botconsole.log(`🔴 [${new Date().toString().split(" ", 5).join(" ")}] Error at shard #${shard.id}:\n${err.stack}`, false, manager);
  })

  shard.on('death', () => {
    botconsole.log(`🔴 [${new Date().toString().split(" ", 5).join(" ")}] Shard #${shard.id} killed`, false, manager);
  })

  shard.on('message', async message => {
    let args = message.toString().split('_');
    if (args[0] === 'restart') {
      if (!args[1]) {
        await manager.respawnAll();
        botconsole.log(`🟢 [${new Date().toString().split(" ", 5).join(" ")}] Shards are online after restart`, false, manager);

      } else if (!isNaN(args[1])) {
        let shardFound = await manager.shards.find(s => s.id === args[1]);
        await shardFound.respawn();
        botconsole.log(`🟢 [${new Date().toString().split(" ", 5).join(" ")}] Shard #${shardFound.id} is online after restart`, false, manager);

      }
    }
  })
});




setTimeout(async () => {
  async function loadProcesses() {
    let ready;
    ready = await manager.broadcastEval(`this.ws.ping`).catch(err => {});
    if (!ready) return loadProcesses();

    //webhookManager.listen();

    if (process.env['TOKEN'] !== process.env['BETA_TOKEN']) {
      webhookManager.updateTotal(manager);

      //STATS POSTER
      setInterval(async () => {
        webhookManager.updateTotal(manager);

      }, 30000 * 20);
    }
  }
  loadProcesses();

}, manager.shards.size + 1 * 8000);

redis();
mongoose();
manager.spawn();