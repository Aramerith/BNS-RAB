const Discord = require('discord.js');
const regions = ['na', 'eu'];
const fetch = require('node-fetch');
const Gear = require('../modules/gearFetch.js');
const DomParser = require('dom-parser');
const { URL } = require('url');
const parser = new DomParser();

module.exports = {
	name: 'gear',
	description: 'Retrieves user\'s gear',
	args: true,
	cooldown: 5,
	usage: '<region> <character name>',
	execute(message, args) {
		if (args.length < 2) {
			return message.reply('Please provide both server region and character name.');
		}
		if (regions.indexOf(args[0].toLowerCase()) < 0) {
			return message.reply(`**${args[0]}** is not a valid option. Use [na/eu] only.`);
		}
		fetch(new URL(`http://${args[0].toLowerCase()}-bns.ncsoft.com/ingame/bs/character/data/equipments?c=${args[1]}`))
			.then(res => res.text())
			.then(body => {
				const check = parser.parseFromString(body);
				if (check.getElementById('equipResult').textContent != 'success') return message.channel.send('Character with that name not found in this region!');
				const gear = new Gear(body);
				let desc = '';
				for (const prop in gear) {
					if (gear[prop] != undefined) {
						desc += `${gear[prop]}\n`;
					}
				}
				const gearEmbed = new Discord.RichEmbed()
					.setColor('#880088')
					.setTitle(`${args[1]} - ${args[0].toUpperCase()}`)
					.setDescription(desc);
				fetch(new URL(`http://${args[0]}-bns.ncsoft.com/ingame/bs/character/profile?c=${args[1]}`))
					.then(res => res.text())
					.then(bodyProfile => {
						const dom = parser.parseFromString(bodyProfile);
						gearEmbed.setThumbnail(dom.getElementsByClassName('charaterView')[0].childNodes[1].getAttribute('src'));
						return message.channel.send(gearEmbed);
					});
			});
	},
};