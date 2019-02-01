const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
const { token } = require('./config.json');
const { Settings } = require('./modules/dbObjects');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('message', message => {
	let prefix = '$';
	if (message.guild !== null) {
		Settings.findOne({ where: { guildID: message.guild.id } }).then(settings => {
			if (settings == null) {
				Settings.upsert({ guildID: message.guild.id }).catch((error) => {
					console.log(error);
				});
			}
			else {
				prefix = settings.dataValues.commandprefix;
			}
		});
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildLeaderOnly && !message.member.hasPermission('ADMINISTRATOR')) {
		return message.reply('This command can only be run by server administrators!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${commandName} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('Can\'t execute this command in DMs!');
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch(error) {
		console.error(error);
		message.reply(`There was a problem with ${commandName} command!`);
	}

});
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({
		game: {
			name: 'with BnS Raids',
			type: 'PLAYING',
		},
		status: 'online',
	});
});

// login to Discord with your app's token
client.login(token);