const { Raids } = require('../modules/dbObjects');
const ItemTierUtils = require('../utils/itemTiersUtils.js');
const { itemTiers } = require('../data/itemTiers.json');
const { GearType } = require('../data/gearTypes.json');
const Discord = require('discord.js');
const ITUtil = new ItemTierUtils(itemTiers);

module.exports = {
	name: 'raidinfo',
	description: 'Displays gear requirements for specified raid.',
	args: true,
	cooldown: 5,
	usage: '<raid name>',
	guildOnly : true,
	async execute(message, args) {
		if (args.length < 1) {
			return message.channel.send('No raid name provided.');
		}
		const raidName = args.join(' ');
		Raids.findOne({ where: { name: raidName, guildID: message.guild.id } }).then(raid => {
			message.channel.send(new Discord.RichEmbed()
				.setColor('#edd449')
				.addField(`${raid.name} raid gear requirements`, `${ITUtil.getTierNameStageStr(GearType.WEAPON, raid.weapon)} weapon
				${ITUtil.getTierNameStageStr(GearType.RING, raid.ring)} ring
				${ITUtil.getTierNameStageStr(GearType.EARRING, raid.earring)} earring
				${ITUtil.getTierNameStageStr(GearType.NECKLACE, raid.necklace)} necklace
				${ITUtil.getTierNameStageStr(GearType.BRACELET, raid.bracelet)} bracelet
				${ITUtil.getTierNameStageStr(GearType.BELT, raid.belt)} belt
				${ITUtil.getTierNameStageStr(GearType.GLOVES, raid.gloves)} gloves
				${ITUtil.getTierNameStageStr(GearType.SOUL, raid.soul)} soul
				${ITUtil.getTierNameStageStr(GearType.HEART, raid.heart)} heart
				${ITUtil.getTierNameStageStr(GearType.PET, raid.pet)} pet
				${ITUtil.getTierNameStageStr(GearType.SOULBADGE, raid.soulBadge)} soul badge
				${ITUtil.getTierNameStageStr(GearType.MYSTICBADGE, raid.mysticBadge)} mystic badge`)
			);
		})
			.catch(() => message.channel.send('No raid with that name found'));
	},
};