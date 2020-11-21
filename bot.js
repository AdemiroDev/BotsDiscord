const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const firebase = require('firebase');
const fs = require("fs");
const path = require("path");

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.login(config.token)

function find_nested(dir, pattern) {

    let results = [];

    fs.readdirSync(dir).forEach(inner_dir => {
        inner_dir = path.resolve(dir, inner_dir);
        const stat = fs.statSync(inner_dir);
        if (stat.isDirectory()) {
            results = results.concat(find_nested(inner_dir, pattern));
        }

        if (stat.isFile() && inner_dir.endsWith(pattern)) {
            results.push(inner_dir);
        }

    });
    
    return results;
}

const cmd_files = find_nested("./comandos/", ".js");

module.exports.setup = (client) => {
       if (cmd_files.length <= 0) return console.log("There are no commands to load...");
    cmd_files.forEach(file => {
        const props = require(file);
        client.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
    console.log(`Carregado ${cmd_files.length} comandos.`);

};

fs.readdir("./comandos/", (err, files) => {
  if (err) console.log(`Novo erro: ${err}`);
  let arquivojs = files.filter(f => f.split(".").pop() === "js");
  arquivojs.forEach((f, i) => {
    let props = require(`./comandos/${f}`)
    console.log(`[ RocketList - Comandos ] Comando ${f} Iniciado !`);
    client.commands.set(props.help.name, props);
  });
  arquivojs.forEach((f, i) => {
    let props = require(`./comandos/${f}`);
        props.help.aliases.forEach(alias => { client.aliases.set(alias, props.help.name); })
  })
})

client.on("ready", async() => {
  
  function setStatus() {
    
  let activities = [
    //{ name: `Use ${config.prefix}help para ver meus comandos!`, type: "WATCHING", status: "idle" },
    //{ name: `Use ${config.prefix}botinfo Para Ver Minhas Informações`, type: "WATCHING", status: "online" },
    //{ name: `Com ${client.commands.size} Comandos!`, type: "PLAYING", status: "dnd" },
    { name: `👋・Com ${client.guilds.cache.size} Servidores!`, type: "STREAMING", status: "idle" },
    { name: `🧤・Com ${client.users.cache.size} Membros`, type: "STREAMING", status: "dnd" },
    { name: `🔰・Prefixo: r.`, type: "PLAYING", status: "online" },
    { name: `🎨・Rocket com ${client.users.cache.size} Membros`, type: "WATCHING", status: "idle" },
    { name: `💥・Rocket List`, type: "WATCHING", status: "dnd" },
  ];
    
    let b = activities[Math.floor(Math.random() * activities.length)];
    
    client.user.setActivity(b);
    
  }
  setStatus();
  setInterval(() => setStatus(), 5000);
  
})

client.on("message", async (message) => {
  
  if(message.author.bot) return;
  if(message.channel.type === 'DM') return;
  if(!message.guild) return;
  
  let prefix = config.prefix
    
if (message.mentions.members.first() == "764922683355168828") {
  
    let embedmen = new Discord.MessageEmbed()
    
    .setColor('black')
    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
    .setDescription("🚀 | Prefixo: `"+prefix+"`\n 🚀 | Comando de ajuda: `"+prefix+"ajuda`")
    .setThumbnail(client.user.displayAvatarURL())
    .setTimestamp()

    return message.channel.send(embedmen)
}

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  
  if (command) {
    
    command.run(client, message, args)
    
  } else {

    let erroembed = new Discord.MessageEmbed()

    .setDescription(`**<:emoji:733770513838506044> | Olá <@!${message.author.id}> o comando **${message.content}** é inexistente !\nVocê deve estar perdido mas por sorte tenho um comando de ajuda: \n\n \`\`\`md\n# ${prefix}help\`\`\`**`)

    message.channel.send(erroembed)
    
  }
})