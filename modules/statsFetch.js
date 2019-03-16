const StatUtils = require('../utils/statUtils.js');


module.exports = class Stats {
	constructor(arg) {
		this.SU = new StatUtils(arg);
		this.json = arg;
	}

	listStats(embed) {
		embed.addBlankField()
			.addField('Attack Power', this.SU.getAP(), true)
			.addField((this.json.records.total_ability.guard_gauge) ? 'Resilience - HP' : 'HP', this.SU.getHP(), true)
			.addField('PvP Attack Power', this.SU.getPvPAP(), true)
			.addField('Defense', this.SU.getDefense(), true)
			.addField('Boss Attack Power', this.SU.getBossAP(), true)
			.addField('PvP Defense', this.SU.getPvPDefense(), true)
			.addField('Piercing', this.SU.getPiercing(), true)
			.addField('Boss Defense', this.SU.getBossDefense(), true)
			.addField('Accuracy', this.SU.getAccuracy(), true)
			.addField('Evasion', this.SU.getEvasion(), true)
			.addField('Critical Hit', this.SU.getCriticalHit(), true)
			.addField('Block', this.SU.getBlock(), true)
			.addField('Critical Damage', this.SU.getCritDamage(), true)
			.addField('Critical Defense', this.SU.getCritDefense(), true)
			.addField('Additional Damage', this.SU.getAdditionalDamage(), true)
			.addField('Damage Reduction', this.SU.getDamageReduction(), true)
			.addField('Threat', this.SU.getThreat(), true)
			.addField('Health Regen', this.SU.getHPRegen(), true)
			.addField('Debuff Damage', this.SU.getDebuffDamage(), true)
			.addField('Recovery', this.SU.getRecovery(), true)
			.addField('Mystic', this.SU.getMystic(), true)
			.addField('Debuff Defense', this.SU.getDebuffDefense(), true);
	}
};