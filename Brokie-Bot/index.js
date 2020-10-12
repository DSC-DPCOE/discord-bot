 const Discord = require("discord.js");
const bot = new Discord({disableEveryone:true});
const botconfig = require("./botconfig.json");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

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
})

bot.login(botconfig.TOKEN);
