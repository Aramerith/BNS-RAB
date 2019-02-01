const { Raids } = require('../modules/dbObjects');
const Discord = require('discord.js');

module.exports = {
	name: 'listraids',
	description: 'Retrieves the list of current raids in this server.',
	args: false,
	cooldown: 5,
	guildOnly : true,
	async execute(message) {
		const raidlist = await Raids.findAll({ where: { guildID: message.guild.id }, attributes: ['name'] });
		const tagString = raidlist.map(t => t.name).join('\n') || 'No raids set.';
		return message.channel.send(
			new Discord.RichEmbed().setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
				.addField('List of Raids', tagString));
	},
};