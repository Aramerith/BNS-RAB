const ModifyRaidHandler = require('../handlers/modifyRaidHandler.js');

module.exports = {
	name: 'addraid',
	description: 'Adds a new raid to this server.',
	args: false,
	cooldown: 5,
	guildOnly : true,
	guildLeaderOnly: true,
	async execute(message) {
		const arh = new ModifyRaidHandler(message);
		arh.addRaid();
	},
};