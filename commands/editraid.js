const { Raids } = require('../modules/dbObjects');
const ModifyRaidHandler = require('../handlers/modifyRaidHandler.js');

module.exports = {
	name: 'editraid',
	description: 'Edit specified raid\'s gear requirements.',
	args: true,
	usage: '<raid name>',
	cooldown: 5,
	guildOnly : true,
	guildLeaderOnly: true,
	async execute(message, args) {
		if (args.length < 1) {
			return message.channel.send('No raid name provided.');
		}
		const raidName = args.join(' ');
		Raids.findOne({ where: { name: raidName, guildID: message.guild.id } }).then(raid => {
			const arh = new ModifyRaidHandler(message, raid.dataValues, true);
			arh.editRaid();
		})
			.catch(() => message.channel.send('No raid with that name found'));
	},
};