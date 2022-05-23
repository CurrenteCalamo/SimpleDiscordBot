

const { SlashCommandBuilder } = require('@discordjs/builders');
let db = require('quick.db')
const { lock } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Создать пользовательскую роль!')
		.addRoleOption(option => option.setName('muted').setDescription('Select a role'))
		.addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))
	,
	async execute(interaction) {

		const role = interaction.options.getRole('muted');
		const integer = interaction.options.getInteger('int');
		const myItems = db.get('myItems')
		if (lock.find(roles => roles == role.name)) return interaction.reply(`not`);
		if (!myItems) {
			db.set('myItems', [])
		}
		if (!integer) return interaction.reply(`get int`);
		if (integer < 50) return interaction.reply(`get int > 50`);
		let tmp = interaction.member._roles
		if (tmp.find(rolea => rolea == role.id)) {

			db.push('myItems', { id: interaction.user.id, role: role, match: integer })
			interaction.member.roles.remove(role)
			return interaction.reply(`this role is  find`);
		}

		return interaction.reply(`not`);
	},
};