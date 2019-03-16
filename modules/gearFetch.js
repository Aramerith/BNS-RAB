const GearUtils = require('../utils/gearUtils.js');


module.exports = class Gear {
	constructor(arg) {
		const GU = new GearUtils(arg);
		this.weapon = GU.getWeapon();
		this.ring = GU.getRing();
		this.earring = GU.getEarring();
		this.necklace = GU.getNecklace();
		this.bracelet = GU.getBracelet();
		this.belt = GU.getBelt();
		this.gloves = GU.getGloves();
		this.soul = GU.getSoul();
		this.heart = GU.getHeart();
		this.pet = GU.getPet();
		this.soulBadge = GU.getSoulBadge();
		this.mysticBadge = GU.getMysticBadge();
		this.nova = GU.getTalisman();
	}
};