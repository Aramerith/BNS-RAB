const StatUtils = require('../utils/statUtils.js');


module.exports = class Stats {
	constructor(arg) {
		const SU = new StatUtils(arg);
		this.ap = SU.getAP();
		this.pvpap = SU.getPvPAP();
		this.bossap = SU.getBossAP();
	}

	listStats(embed) {
		embed.addField('AP', this.ap, true);
	}
};