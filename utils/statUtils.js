const DomParser = require('dom-parser');
const parser = new DomParser();

module.exports = class GearUtil {
	constructor(basehmtl) {
		this.dom = parser.parseFromString(basehmtl);
	}

	getAP() {
		return 1600;
	}

	getPvPAP() {
		return 1700;
	}

	getBossAP() {
		return 2000;
	}

	baseCall(className) {
		try {
			return this.dom.getElementsByClassName(className)[0].getElementsByClassName('name')[0].childNodes[1].textContent;
		}
		catch(error) {
			return undefined;
		}
	}
};