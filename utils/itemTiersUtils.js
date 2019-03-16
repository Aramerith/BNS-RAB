const { GearType } = require('../data/gearTypes.json');

module.exports = class ItemTierUtil {
	constructor(jsonData) {
		this.itemTiers = jsonData;
	}

	getTiersAndNamesStr(type) {
		return this.itemTiers[type].map((item) => {
			return `${item.tierLevel} - ${item.name}`;
		}).join('\n');
	}

	getStagesStr(type) {
		return this.itemTiers[type].map((item) => {
			return (!item.hasStages) ? '0' : `${(type === GearType.SOULBADGE || type === GearType.MYSTICBADGE) ? '0' : '1'} - ${item.maxStage}`;
		}).join('\n');
	}

	getTierNameStageStr(type, tierStage) {
		const tsvals = tierStage.split(/ +/);
		const itemName = this.itemTiers[type].filter(obj => {
			return obj.tierLevel === parseInt(tsvals[0]);
		});
		if (tsvals.length === 2) {
			if (tsvals[1] > 10 && type != GearType.WEAPON) return `_Awakened ${itemName[0].name} - Stage ${parseInt(tsvals[1]) - 10}_`;
			if (type === GearType.SOULBADGE || type === GearType.MYSTICBADGE) {
				if (tsvals[1] == 0) return `${itemName[0].name}`;
				else return `_Awakened ${itemName[0].name} - Stage ${tsvals[1]}_`;
			}
			else {
				return `_${itemName[0].name} - Stage ${tsvals[1]}_`;
			}
		}
		else {
			return `_${itemName[0].name}_`;
		}
	}

	validateTierStageInput(type, tierStage) {
		const tsvals = tierStage.split(' ');
		const itemName = this.itemTiers[type].filter(obj => {
			return obj.tierLevel === parseInt(tsvals[0]);
		});
		if (itemName.length === 0) return false;
		if (itemName[0].hasStages && tsvals.length === 1) return false;
		if (tsvals.length === 2) {
			if (isNaN(tsvals[1])) return false;
			if (isNaN(tsvals[0])) return false;
			if (itemName[0].hasStages && (parseInt(tsvals[1]) > itemName[0].maxStage || parseInt(tsvals[1] < 1))) return false;
		}
		return true;
	}

	compareStringToTier(userItem, type) {
		if (userItem == undefined) return '0';
		if (type == GearType.SOUL && userItem == 'Stormbringer Soul') return '1 5';
		if (type == GearType.PET && userItem == 'Stormbringer Pet Aura') return '1 5';
		if (type == GearType.TALISMAN && userItem == 'Eternal Hongmoon') return '1 1';
		for (let i = this.itemTiers[type].length - 1; i > 0; i--) {
			const strvals = this.itemTiers[type][i].fullName ? this.itemTiers[type][i].fullName.split('/') : this.itemTiers[type][i].name.split('/');
			for (let j = 0; j < strvals.length; j++) {
				if (userItem.includes(strvals[j])) {
					if (this.itemTiers[type][i].hasStages) {
						let stageNr = parseInt(userItem.split(' ').pop());
						if (type != GearType.PET && type != GearType.SOUL && type != GearType.HEART) {
							if (userItem.includes('Awakened')) {
								stageNr += 10;
							}
						}
						if (isNaN(stageNr)) stageNr = 0;
						return `${this.itemTiers[type][i].tierLevel} ${stageNr}`;
					}
					else {
						return `${this.itemTiers[type][i].tierLevel}`;
					}
				}
			}
		}
		return '0';
	}
};