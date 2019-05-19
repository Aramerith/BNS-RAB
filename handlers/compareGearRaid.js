const ItemTierUtils = require('../utils/itemTiersUtils.js');
const { itemTiers } = require('../data/itemTiers.json');
const { Raids } = require('../modules/dbObjects');
const { GearType } = require('../data/gearTypes.json');
const Discord = require('discord.js');
const ITUtil = new ItemTierUtils(itemTiers);

module.exports = class GearCompare {
	constructor(ugear, guildID, channel, character, member) {
		this.ugear = ugear;
		this.guildID = guildID;
		this.characterName = character;
		this.channel = channel;
		this.member = member;
		this.ugearTiered = {};
	}

	applyToRaids() {
		this.getUserGearTiers();
		Raids.findAll({ where: { guildID: this.guildID } }).then(raids => {
			if (raids.length == 0) {
				this.channel.send('No raids have been created.');
			}
			for (let i = 0; i < raids.length; i++) {
				this.compareReqGear(raids[i].dataValues);
			}
		})
			.catch(() => this.channel.send('No raids have been set up yet.'));
	}

	getUserGearTiers() {
		for (const prop in GearType) {
			if (GearType.hasOwnProperty(prop)) {
				this.ugearTiered[GearType[prop]] = ITUtil.compareStringToTier(this.ugear[GearType[prop]], GearType[prop]);
			}
		}
	}

	compareReqGear(raid) {
		const missingReqs = [];
		for (const prop in GearType) {
			if (GearType.hasOwnProperty(prop)) {
				const uvals = this.ugearTiered[GearType[prop]].split(' ');
				const rvals = raid[GearType[prop]].split(' ');
				if (parseInt(uvals[0]) < parseInt(rvals[0])) {
					missingReqs.push(`Missing ${this.displayGearTypeByProp(prop)} requirement.\n**Need**: ${ITUtil.getTierNameStageStr(GearType[prop], raid[GearType[prop]])}; **Got**: ${this.ugear[GearType[prop]] ? this.ugear[GearType[prop]] : 'None'}.\n`);
				}
				if (rvals.length == 2 && parseInt(uvals[0]) == parseInt(rvals[0])) {
					if ((parseInt(uvals[1]) < parseInt(rvals[1])) || (uvals.length == 1)) {
						missingReqs.push(`Missing ${this.displayGearTypeByProp(prop)} requirement.\n**Need**: ${ITUtil.getTierNameStageStr(GearType[prop], raid[GearType[prop]])}; **Got**: ${this.ugear[GearType[prop]] ? this.ugear[GearType[prop]] : 'None'}.\n`);
					}
				}
			}
		}
		this.displayResult(missingReqs, raid);
	}

	displayGearTypeByProp(prop) {
		if (prop == 'SOULBADGE') return 'soul badge';
		if (prop == 'MYSTICBADGE') return 'mystic badge';
		if (prop == 'TALISMAN') return 'talisman';
		return GearType[prop];
	}

	displayResult(missingReqs, raid) {
		const displayResult = new Discord.RichEmbed().setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
		if (missingReqs.length == 0) {
			let successText = 'All requirements met.';
			const raidRole = this.channel.guild.roles.find(role => role.name === `${raid.name} Ready`);
			if (!raidRole) {
				this.channel.guild.createRole({
					name: `${raid.name} Ready`,
					color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				}).then(role => {
					if (!this.member.roles.has(role.id)) {
						this.member.addRole(role.id).catch(error => console.log(error));
						successText = 'All requirements met. You have been assigned a new role.';
					}
				});
			}
			else if (!this.member.roles.has(raidRole.id)) {
				this.member.addRole(raidRole.id).catch(error => console.log(error));
				successText = 'All requirements met. You have been assigned a new role.';
			}
			displayResult.addField(raid.name, successText);
		}
		else {
			displayResult.setTitle(raid.name)
				.setDescription(missingReqs.join('\n'));
		}
		displayResult.setFooter(`Raid application from ${this.characterName}`);
		this.channel.send(displayResult);
	}
};