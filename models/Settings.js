module.exports = (Sequelize, DataTypes) => {
	return Sequelize.define('settings', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		guildID: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		commandprefix: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '$',
		},
		applicationschannelid: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});
};