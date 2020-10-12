const Discord = require("discord.js");
const bot = new Discord({disableEveryone:true});
const botconfig = require("./botconfig.json");
const fs = require("fs");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

//READ COMMANDS FOLDER
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Commands not found!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`)
        console.log(`${f} loaded!`);

        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias =>{
            bot.aliases.set(alias, props.help.name);
        })
    })
})

//BOT ONLINE MESSAGE AND ACTIVITY MESSAGE
bot.on("ready", async message =>{
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers! `);
    bot.user.setActivity(`with ${bot.guilds.size} servers`);
})

bot.on("message", async message =>
{
    //CHECK CHANNEL TYPE
    if(message.channel.type === 'dm')  return;
    if(message.author.bot) return;

    //SET PREFIX
    let prefix = botconfig.PREFIX;

    //CHECK PREFIX, ARGS, COMMANDS
    if(!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    let command;
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

    //RUN COMMANDS
    if(bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else if(bot.aliases.has(cmd)){
        command = bot.commands.get(bot.aliases.get(cmd));
    }

    try{
        command.run(bot,message, args);
    } catch(e){
        return;
    }
})

bot.login(botconfig.TOKEN);
