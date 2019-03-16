module.exports = class StatUtil {
	constructor(data) {
		this.data = data.records.total_ability;
	}

	getAP() {
		return this.data.attack_power_value;
	}

	getPvPAP() {
		return this.data.pc_attack_power_value;
	}

	getBossAP() {
		return this.data.boss_attack_power_value;
	}

	getHP() {
		if (this.data.guard_gauge) {
			return `${this.data.guard_gauge} - ${this.data.max_hp}`;
		}
		else {
			return this.data.max_hp;
		}
	}

	getDefense() {
		return `${this.data.defend_power_value} (${this.data.defend_physical_damage_reduce_rate}%)`;
	}

	getPvPDefense() {
		return `${this.data.pc_defend_power_value} (${this.data.pc_defend_power_rate}%)`
	}

	getBossDefense() {
		return `${this.data.boss_defend_power_value} (${this.data.boss_defend_power_rate}%)`;
	}

	getPiercing() {
		return `${this.data.attack_pierce_value} (${this.data.attack_defend_pierce_rate}% | ${this.data.attack_parry_pierce_rate}%)`;
	}

	getAccuracy() {
		return `${this.data.attack_hit_value} (${this.data.attack_hit_rate}%)`;
	}

	getEvasion() {
		return `${this.data.defend_dodge_value} (${this.data.defend_dodge_rate}%)`;
	}

	getCriticalHit() {
		return `${this.data.attack_critical_value} (${this.data.attack_critical_rate}%)`;
	}

	getBlock() {
		return `${this.data.defend_parry_value} (${this.data.defend_parry_rate}%)`;
	}

	getCritDamage() {
		return `${this.data.attack_critical_damage_value} (${this.data.attack_critical_damage_rate}%)`;
	}

	getCritDefense() {
		return `${this.data.defend_critical_value} (${this.data.defend_critical_rate}% | ${this.data.defend_critical_damage_rate}%)`;
	}

	getAdditionalDamage() {
		return `${this.data.attack_damage_modify_diff} (${this.data.attack_damage_modify_rate}%)`;
	}

	getDamageReduction() {
		return `${this.data.defend_damage_modify_diff} (${this.data.defend_damage_modify_rate}%)`;
	}

	getThreat() {
		return `${this.data.hate_power_rate}%`;
	}

	getHPRegen() {
		return `${this.data.hp_regen} (Combat ${this.data.hp_regen_combat})`;
	}

	getDebuffDamage() {
		return `${this.data.abnormal_attack_power_value} (${this.data.abnormal_attack_power_rate}%)`;
	}

	getRecovery() {
		return `${this.data.heal_power_rate}% (${this.data.heal_power_value}+${this.data.heal_power_diff})`;
	}

	getMystic() {
		return `${this.data.attack_attribute_value} (${this.data.attack_attribute_rate}%)`;
	}

	getDebuffDefense() {
		return `${this.data.abnormal_defend_power_value} (${this.data.abnormal_defend_power_rate}%)`;
	}
};