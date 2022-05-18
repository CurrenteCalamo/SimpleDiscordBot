const { SlashCommandBuilder } = require('@discordjs/builders');
let db = require('quick.db')
const { lock } = require('../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Создать пользовательскую роль!')
		.addStringOption(option => option.setName('color').setDescription('Цвет вашей будущей роли в формате #000000'))
		.addStringOption(option => option.setName('message').setDescription('Название вашей будущей роли.')),
	async execute(interaction) {
		const color = interaction.options.getString('color');
		const messages = String(interaction.options.getString('message'));
		let uid = interaction.user.id
		let sid = interaction.guild.id
		let money = db.get(`money_${sid}_${uid}`)

		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		if (color.startsWith('#') && !(color.length == 7))
			return interaction.reply(`**Неправильно** указан цвет **пример** цвета #ffffff`);
		if (lock.find(dev => messages == dev)) return interaction.reply(`Так не **пойдет**!`);
		if (money >= 1000) {
			db.set(`money_${sid}_${uid}`, money - 1000)
			await interaction.guild.roles.create({
				name: messages,
				color: color,
				permissions: []
			})

			await interaction.member.roles.add(interaction.guild.roles.cache.find(r => (r.name == messages)))

			return interaction.reply(`**Роль** создана.`);

		} else {
			return interaction.reply(`У вас **недостаточно** средств кастомная **роль** стоит 1000 койнов. Ваш баланс **${money}**`);
		}

	},
};