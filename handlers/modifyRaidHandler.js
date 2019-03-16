const ItemTierUtils = require('../utils/itemTiersUtils.js');
const { itemTiers } = require('../data/itemTiers.json');
const { Raids } = require('../modules/dbObjects');
const { GearType } = require('../data/gearTypes.json');
const Discord = require('discord.js');
const ITUtil = new ItemTierUtils(itemTiers);

module.exports = class ModifyRaidHandler {
	constructor(message, raidData = undefined, saved = false) {
		if (raidData) {
			this.raidData = raidData;
		}
		else {
			this.raidData = {
				guildID: message.guild.id,
			};
		}
		this.isSaved = saved;
		this.raidErr = 'Selected option is not a valid choice. Raid creation canceled.';
		this.raidErrSaved = 'Selected option is not a valid choice. Command canceled.';
		this.raidErrCatch = err => {
			this.raidData = {};
			return message.channel.send((typeof err == 'string') ? err : 'You did not enter any input! New raid creation canceled.');
		};
		this.message = message;
		this.filter = this.filter = m => this.message.author.id === m.author.id;
		this.amParams = { time: 60000, maxMatches: 1, errors: ['time'] };
	}

	addRaid() {
		this.selectName(this.message);
	}

	editRaid() {
		this.listEditChoices(this.message);
	}

	selectName(msg, edit = false) {
		msg.channel.send((edit) ? 'Please enter new name' : 'Please enter the name of the new raid.').then(() => {
			this.message.channel.awaitMessages(this.filter, this.amParams)
				.then(msgName => {
					this.raidData.name = msgName.first().content;
					(edit) ? this.confirmRaid(msgName.first()) : this.selectWeapon(msgName.first());
				})
				.catch(this.raidErrCatch);
		}).catch(() => {
			return this.message.channel.send('You did not enter any input! New raid creation canceled.');
		});
	}

	selectWeapon(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new weapon requirement.' : `${msg.content}, okay got it. Required weapon for this raid?`,
			GearType.WEAPON,
			{
				title: 'Explanation',
				description: 'Please type in tier number and stage number.\nIf item tier does not have stages, type in only tier number.\n_Examples_: `1 6`  ;  `0`',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgWeapon => {
				if(this.inputCheck(GearType.WEAPON, msgWeapon.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgWeapon.first()) : this.selectRing(msgWeapon.first());
			}).catch(this.raidErrCatch);
	}

	selectRing(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new ring requirement.' : `${ITUtil.getTierNameStageStr(GearType.WEAPON, this.raidData.weapon)} selected. What about ring?`,
			GearType.RING,
			{
				title: 'Additional info',
				description: 'Stages above 10 for accessories mean Awakened stages.\nStage 11 is equal to Awakened Stage 1 and so on.',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgRing => {
				if (this.inputCheck(GearType.RING, msgRing.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgRing.first()) : this.selectEarring(msgRing.first());
			}).catch(this.raidErrCatch);
	}

	selectEarring(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new earring requirement.' : `${ITUtil.getTierNameStageStr(GearType.RING, this.raidData.ring)} selected. Now choose earring.`,
			GearType.EARRING,
			{
				title: 'Additional info',
				description: 'Stages above 10 for accessories mean Awakened stages.\nStage 11 is equal to Awakened Stage 1 and so on.',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgEarring => {
				if(this.inputCheck(GearType.EARRING, msgEarring.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgEarring.first()) : this.selectNecklace(msgEarring.first());
			}).catch(this.raidErrCatch);
	}

	selectNecklace(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new necklace requirement.' : `${ITUtil.getTierNameStageStr(GearType.EARRING, this.raidData.earring)} selected. Necklace time.`,
			GearType.NECKLACE,
			{
				title: 'Additional info',
				description: 'Stages above 10 for accessories mean Awakened stages.\nStage 11 is equal to Awakened Stage 1 and so on.',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgNecklace => {
				if(this.inputCheck(GearType.NECKLACE, msgNecklace.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgNecklace.first()) : this.selectBracelet(msgNecklace.first());
			}).catch(this.raidErrCatch);
	}

	selectBracelet(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new bracelet requirement.' : `${ITUtil.getTierNameStageStr(GearType.NECKLACE, this.raidData.necklace)} selected. Pick a bracelet.`,
			GearType.BRACELET,
			{
				title: 'Additional info',
				description: 'Stages above 10 for accessories mean Awakened stages.\nStage 11 is equal to Awakened Stage 1 and so on.',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgBracelet => {
				if(this.inputCheck(GearType.BRACELET, msgBracelet.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgBracelet.first()) : this.selectBelt(msgBracelet.first());
			}).catch(this.raidErrCatch);
	}

	selectBelt(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new belt requirement.' : `${ITUtil.getTierNameStageStr(GearType.BRACELET, this.raidData.bracelet)} selected. Decide on belt.`,
			GearType.BELT,
			{
				title: 'Additional info',
				description: 'Stages above 10 for accessories mean Awakened stages.\nStage 11 is equal to Awakened Stage 1 and so on.',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgBelt => {
				if(this.inputCheck(GearType.BELT, msgBelt.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgBelt.first()) : this.selectGloves(msgBelt.first());
			}).catch(this.raidErrCatch);
	}

	selectGloves(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new gloves requirement.' : `${ITUtil.getTierNameStageStr(GearType.BELT, this.raidData.belt)} selected. Select gloves.`,
			GearType.GLOVES,
			{
				title: 'Additional info',
				description: 'Stages above 10 for accessories mean Awakened stages.\nStage 11 is equal to Awakened Stage 1 and so on.',
			}
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgGloves => {
				if(this.inputCheck(GearType.GLOVES, msgGloves.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgGloves.first()) : this.selectSoul(msgGloves.first());
			}).catch(this.raidErrCatch);
	}

	selectSoul(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new soul requirement.' : `${ITUtil.getTierNameStageStr(GearType.GLOVES, this.raidData.gloves)} selected. Soul?`,
			GearType.SOUL
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgSoul => {
				if(this.inputCheck(GearType.SOUL, msgSoul.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgSoul.first()) : this.selectHeart(msgSoul.first());
			}).catch(this.raidErrCatch);
	}

	selectHeart(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new heart requirement.' : `${ITUtil.getTierNameStageStr(GearType.SOUL, this.raidData.soul)} selected. And heart?`,
			GearType.HEART
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgHeart => {
				if(this.inputCheck(GearType.HEART, msgHeart.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgHeart.first()) : this.selectPet(msgHeart.first());
			}).catch(this.raidErrCatch);
	}

	selectPet(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new pet requirement.' : `${ITUtil.getTierNameStageStr(GearType.HEART, this.raidData.heart)} selected. Pet's turn.`,
			GearType.PET
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgPet => {
				if(this.inputCheck(GearType.PET, msgPet.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgPet.first()) : this.selectSoulBadge(msgPet.first());
			}).catch(this.raidErrCatch);
	}

	selectSoulBadge(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new soul badge requirement.' : `${ITUtil.getTierNameStageStr(GearType.PET, this.raidData.pet)} selected. Time to select soul badge.`,
			GearType.SOULBADGE
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgSoulBadge => {
				if(this.inputCheck(GearType.SOULBADGE, msgSoulBadge.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgSoulBadge.first()) : this.selectMysticBadge(msgSoulBadge.first());
			}).catch(this.raidErrCatch);
	}

	selectMysticBadge(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new mystic badge requirement.' : `${ITUtil.getTierNameStageStr(GearType.SOULBADGE, this.raidData.soulBadge)} selected. Now mystic badge.`,
			GearType.MYSTICBADGE
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgMysticBadge => {
				if (this.inputCheck(GearType.MYSTICBADGE, msgMysticBadge.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				(edit) ? this.confirmRaid(msgMysticBadge.first()) : this.selectTalisman(msgMysticBadge.first());
			}).catch(this.raidErrCatch);
	}

	selectTalisman(msg, edit = false) {
		msg.channel.send(this.generateEmbedSelect(
			(edit) ? 'Select new talisman requirement' : `${ITUtil.getTierNameStageStr(GearType.MYSTICBADGE, this.raidData.mysticBadge)} selected. And finally a talisman.`,
			GearType.TALISMAN
		));
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgTalisman => {
				if (this.inputCheck(GearType.TALISMAN, msgTalisman.first())) return msg.channel.send((this.isSaved) ? this.raidErrSaved : this.raidErr);
				this.confirmRaid(msgTalisman.first());
			}).catch(this.raidErrCatch);
	}

	confirmRaid(msg) {
		const confirmEmbed = new Discord.RichEmbed()
			.setColor('#edd449')
			.setDescription('Is everything correct? [yes/no]')
			.addField(`${this.raidData.name}`, `${ITUtil.getTierNameStageStr(GearType.WEAPON, this.raidData.weapon)} weapon
			${ITUtil.getTierNameStageStr(GearType.RING, this.raidData.ring)} ring
			${ITUtil.getTierNameStageStr(GearType.EARRING, this.raidData.earring)} earring
			${ITUtil.getTierNameStageStr(GearType.NECKLACE, this.raidData.necklace)} necklace
			${ITUtil.getTierNameStageStr(GearType.BELT, this.raidData.belt)} belt
			${ITUtil.getTierNameStageStr(GearType.GLOVES, this.raidData.gloves)} gloves
			${ITUtil.getTierNameStageStr(GearType.SOUL, this.raidData.soul)} soul
			${ITUtil.getTierNameStageStr(GearType.HEART, this.raidData.heart)} heart
			${ITUtil.getTierNameStageStr(GearType.PET, this.raidData.pet)} pet
			${ITUtil.getTierNameStageStr(GearType.SOULBADGE, this.raidData.soulBadge)} soul badge
			${ITUtil.getTierNameStageStr(GearType.MYSTICBADGE, this.raidData.mysticBadge)} mystic badge
			${ITUtil.getTierNameStageStr(GearType.TALISMAN, this.raidData.nova)} talisman`)
			.addBlankField()
			.setFooter(`${this.raidData.name} raid. Status - ${(this.isSaved) ? 'saved' : 'unsaved'}.`);
		msg.channel.send(confirmEmbed);

		this.confirmPrompt(msg);
	}

	confirmPrompt(msg) {
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgAns => {
				const ans = msgAns.first().content.toLowerCase();
				if (ans != 'no' && ans != 'yes' && ans != 'exit') {
					msgAns.first().channel.send('Incorrect answer. Please type _yes_,_no_ or _exit_ only.');
					this.confirmPrompt(msgAns.first());
				}
				else if (ans == 'no') {
					this.listEditChoices(msgAns.first());
				}
				else if (ans == 'yes') {
					this.saveRaid();
				}
				else if (ans == 'exit') {
					return msg.channel.send('Command canceled.');
				}
			})
			.catch(this.raidErrCatch);
	}

	listEditChoices(msg) {
		const editableChoices = new Discord.RichEmbed()
			.setColor('#edd449')
			.setDescription('What do you want to change?')
			.addField('List of Options', '0 - Name\n1 - Weapon\n2 - Ring\n3 - Earring\n4 - Necklace\n5 - Belt\n6 - Gloves\n7 - Soul\n8 - Heart\n9 - Pet\n10 - Soul Badge\n11 - Mystic Badge\n12 - Talisman')
			.addBlankField()
			.setFooter(`${this.raidData.name} raid. Status - ${(this.isSaved) ? 'saved' : 'unsaved'}.`);
		msg.channel.send(editableChoices);
		msg.channel.awaitMessages(this.filter, this.amParams)
			.then(msgChoice => {
				// Get the choice and assign proper fn call
				const msgc = msgChoice.first();
				const choiceNr = parseInt(msgc.content);
				switch(choiceNr) {
				case 0:
					this.selectName(msgc, true);
					break;
				case 1:
					this.selectWeapon(msgc, true);
					break;
				case 2:
					this.selectRing(msgc, true);
					break;
				case 3:
					this.selectEarring(msgc, true);
					break;
				case 4:
					this.selectNecklace(msgc, true);
					break;
				case 5:
					this.selectBelt(msgc, true);
					break;
				case 6:
					this.selectGloves(msgc, true);
					break;
				case 7:
					this.selectSoul(msgc, true);
					break;
				case 8:
					this.selectHeart(msgc, true);
					break;
				case 9:
					this.selectPet(msgc, true);
					break;
				case 10:
					this.selectSoulBadge(msgc, true);
					break;
				case 11:
					this.selectMysticBadge(msgc, true);
					break;
				case 12:
					this.selectTalisman(msgc, true);
					break;
				default:
					msgc.channel.send('Invalid option selected. Command canceled.');
				}
			})
			.catch(this.raidErrCatch);
	}

	generateEmbedSelect(desc, type, addinfo) {
		const embed = new Discord.RichEmbed()
			.setColor('#edd449')
			.setDescription(desc)
			.addField('Tier - Name', ITUtil.getTiersAndNamesStr(type), true)
			.addField('Stages', ITUtil.getStagesStr(type), true);
		if (addinfo) {
			embed.addBlankField().addField(addinfo.title, addinfo.description);
		}
		embed.addBlankField().setFooter(`${this.raidData.name} raid. Status - ${(this.isSaved) ? 'saved' : 'unsaved'}.`);
		return embed;
	}

	inputCheck(type, msg) {
		if (!ITUtil.validateTierStageInput(type, msg.content)) return true;
		this.raidData[type] = msg.content;
		return false;
	}

	saveRaid() {
		Raids.upsert(this.raidData).then(() => {
			return this.message.channel.send((this.isSaved) ? `${this.raidData.name} raid updated.` : 'Raid created!');
		}).catch((error) => {
			console.log(error);
			return this.message.channel.send('There was an issue creating your raid.');
		});
	}
};