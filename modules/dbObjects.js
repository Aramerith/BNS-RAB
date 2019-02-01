const Sequelize = require('sequelize');

const db = new Sequelize('bnsrabdb', null, null, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'bnsrab.sqlite',
	operatorsAliases: false,
});

const Raids = db.import('../models/Raids');
const Settings = db.import('../models/Settings');

module.exports = { Raids, Settings };