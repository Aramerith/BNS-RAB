const Sequelize = require('sequelize');

const sequelize = new Sequelize('bnsrabdb', null, null, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'bnsrab.sqlite',
	operatorsAliases: false,
});

sequelize.import('models/Raids');
sequelize.import('models/Settings');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	sequelize.close();
});