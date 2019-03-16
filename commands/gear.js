const Discord = require('discord.js');
const regions = ['na', 'eu'];
const fetch = require('node-fetch');
const Gear = require('../modules/gearFetch.js');
const Stats = require('../modules/statsFetch.js');
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
				let desc = '';
				for (const prop in gear) {
					if (gear[prop] != undefined) {
						desc += `${gear[prop]}\n`;
					}
				}
				const gearEmbed = new Discord.RichEmbed()
					.setColor('#880088')
					.setTitle(`${charName} - ${region.toUpperCase()}`)
					.addField('Equipment', desc);
				fetch(new URL(`http://${region}-bns.ncsoft.com/ingame/bs/character/profile?c=${charName}`))
					.then(res => res.text())
					.then(bodyProfile => {
						const dom = parser.parseFromString(bodyProfile);
						const pfp = dom.getElementsByClassName('charaterView')[0].childNodes[1].getAttribute('src');
						const igDescBody = dom.getElementsByClassName('desc')[0].childNodes[1];
						const igClass = igDescBody.childNodes[1].textContent;
						let igLevel = igDescBody.childNodes[3].textContent;
						igLevel = igLevel.replace('&bull;', '•');
						gearEmbed.setThumbnail(pfp);
						gearEmbed.setDescription(`_${igClass} | ${igLevel}_.`);
						fetch(new URL(`http://${region}-bns.ncsoft.com/ingame/bs/character/data/abilities.json?c=${charName}`))
							.then(res => res.json())
							.then(statsJson => {
								const stats = new Stats(statsJson);
								stats.listStats(gearEmbed);
								return message.channel.send(gearEmbed);
							});
					});
			});
	},
};