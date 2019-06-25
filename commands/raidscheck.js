const regions = ['na', 'eu'];
const fetch = require('node-fetch');
const Gear = require('../modules/gearFetch.js');
const DomParser = require('dom-parser');
const parser = new DomParser();
const GearCompare = require('../handlers/compareGearRaid.js');
const { URL } = require('url');

module.exports = {
	name: 'raidscheck',
	aliases: ['checkraids', 'checkgear'],
	description: 'Checks the gear of the provided character against existing raids and returns the results in direct message.',
	args: true,
	cooldown: 5,
	requiresDB: false,
	usage: '<region> <character name>',
	execute(message, args) {
		const channel = message.author;
		const region = args[0];
		args.shift();
		const charName = args.join(' ');
		if (args.length < 1) {
			return message.reply('Please provide both server region and character name.');
		}
		if (regions.indexOf(region.toLowerCase()) < 0) {
			return message.reply(`**${region}** is not a valid option. Use [na/eu] only.`);
		}
		fetch(new URL(`http://${region.toLowerCase()}-bns.ncsoft.com/ingame/bs/character/data/equipments?c=${charName}`))
			.then(res => res.text())
			.then(body => {
				const check = parser.parseFromString(body);
				if (check.getElementById('equipResult').textContent != 'success') return message.channel.send('Character with that name not found in this region!');
				const gear = new Gear(body);
				const gearComparer = new GearCompare(gear, message.guild.id, channel, charName, message.member, true);
				gearComparer.applyToRaids();
			});
	},
};