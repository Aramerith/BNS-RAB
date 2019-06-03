const { Raids } = require('../modules/dbObjects');
const Discord = require('discord.js');

module.exports = {
	name: 'lrrm',
	description: 'Lists server members who are ready for specific raids',
	aliases: ['listraidreadymembers', 'listmembers', 'raidreadymembers'],
	args: false,
	cooldown: 5,
	guildOnly : true,
	async execute(message) {
		Raids.findAll({ where: { guildID: message.guild.id } }).then(raids => {
			if (raids.length == 0) {
				message.channel.send('No raids have been created.');
			}
			for (let i = 0; i < raids.length; i++) {

				// TODO: Add pagination support somehow in case members list becomes too long.
				const memberswithrole = message.guild.members.filter(member => {
					return member.roles.find(role => role.name === `${raids[i].name} Ready`);
				}).map(member => {
					return member.displayName;
				});
				const lrrmEmbed = new Discord.RichEmbed().setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
				if (memberswithrole.length > 0) {
					lrrmEmbed.setTitle(`${memberswithrole.length} ${raids[i].name} ready ${memberswithrole.length == 1 ? 'member' : 'members'}.`)
						.setDescription(memberswithrole.join('\n'));
				}
				else {
					lrrmEmbed.setTitle(`No ${raids[i].name} ready members.`);
				}
				message.channel.send(lrrmEmbed);
			}
		})
			.catch(() => message.channel.send('No raids have been set up yet.'));
	},
};