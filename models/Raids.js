module.exports = (Sequelize, DataTypes) => {
	return Sequelize.define('raids', {
		raidID: {
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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		weapon: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ring: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		earring: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		necklace: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		bracelet: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		belt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gloves: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		soul: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		heart: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pet: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		soulBadge: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mysticBadge: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nova: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
	});
};