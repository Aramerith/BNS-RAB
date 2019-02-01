const { Settings } = require('../modules/dbObjects');

module.exports = {
	name: 'setaplch',
	description: 'Sets application channel',
	args: true,
	cooldown: 5,
	usage: '<channel id or mention>',
	guildOnly : true,
	guildLeaderOnly: true,
	async execute(message, args) {
		const aplch = args[0].replace(/\D/g, '');
		const channel = message.guild.channels.get(aplch);
		if (channel != undefined) {
			Settings.findOne({ where: { guildID: message.guild.id } }).then(settings => {
				settings.dataValues.applicationschannelid = channel.id;
				Settings.upsert(settings.dataValues).then(() => {
					message.channel.send('Raid applications channel set.');
				});
			});
		}
		else {
			message.reply('Specified channel was not found.');
		}
	},
};