const DomParser = require("dom-parser");
const parser = new DomParser();

module.exports = class GearUtil{
    constructor(basehmtl) {
        this.dom = parser.parseFromString(basehmtl);
    }
    getWeapon(){
        return this.baseCall("wrapWeapon");
    }
    getRing(){
        return this.baseCall("wrapAccessory ring");
    }
    getEarring(){
        return this.baseCall("wrapAccessory earring");
    }

    getNecklace(){
        return this.baseCall("wrapAccessory necklace");
    }

    getBracelet(){
        return this.baseCall("wrapAccessory bracelet");
    }

    getBelt(){
        return this.baseCall("wrapAccessory belt");
    }

    getGloves(){
        return this.baseCall("wrapAccessory gloves");
    }

    getSoul(){
        return this.baseCall("wrapAccessory soul");
    }

    getHeart(){
        return this.baseCall("wrapAccessory soul-2");
    }

    getPet(){
        return this.baseCall("wrapAccessory guard");
    }

    getSoulBadge(){
        return this.baseCall("wrapAccessory singongpae");
    }

    getMysticBadge(){
        return this.baseCall("wrapAccessory rune");
    }

    baseCall(className){
        try {
            return this.dom.getElementsByClassName(className)[0].getElementsByClassName("name")[0].childNodes[1].textContent;
        }
        catch(error){
            return undefined;
        }
    }
}