const Discord = require("discord.js");
const regions = ["na", "eu"];
const fetch = require("node-fetch");
const Gear = require("../modules/gear-fetch.js");
const DomParser = require("dom-parser");
const parser = new DomParser();

module.exports = {
    name: "gear",
    description: "Retrieves user's gear",
    args: true,
    cooldown: 5,
    usage: "<region> <character name>",
    execute(message, args) {
        if (args.length < 2){
            return message.reply(`Please provide both server region and character name.`);
        }
        if (regions.indexOf(args[0].toLowerCase()) < 0 ){
            return message.reply(`**${args[0]}** is not a region.`);
        }

        fetch(`http://${args[0]}-bns.ncsoft.com/ingame/bs/character/data/equipments?c=${args[1]}`)
            .then(res => res.text())
            .then(body => {
                let check = parser.parseFromString(body);
                if (check.getElementById("equipResult").textContent != "success") return message.channel.send("Character with that name not found in this region!");
                let gear = new Gear(body);
                let desc = "";
                for (let prop in gear){
                    if (gear[prop] != undefined){
                        desc += `${gear[prop]}\n`;
                    }
                }
                const gearEmbed = new Discord.RichEmbed()
                .setColor("#880088")
                .setTitle(`${args[1]} - ${args[0].toUpperCase()}`)
                .setDescription(desc);
                fetch(`http://${args[0]}-bns.ncsoft.com/ingame/bs/character/profile?c=${args[1]}`)
                    .then(res => res.text())
                    .then(body => {
                        let dom = parser.parseFromString(body);
                        gearEmbed.setThumbnail(dom.getElementsByClassName("charaterView")[0].childNodes[1].getAttribute("src"));
                        return message.channel.send(gearEmbed);
                    })
            });
    },
};