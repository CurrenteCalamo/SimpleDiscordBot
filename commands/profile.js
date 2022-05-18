let db = require('quick.db')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Получить профиль выбранного пользователя или свой собственный.')
		.addUserOption(option => option.setName('target').setDescription('Пользователь')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		if (user) {


			let uid = user.id
			let sid = interaction.guild.id

			let money = db.get(`money_${sid}_${uid}`)
			let xp = db.get(`xp_${sid}_${uid}`)
			let lvl = db.get(`lvl_${sid}_${uid}`)
			if (xp == null) {
				db.set(`xp_${sid}_${uid}`, 0)
				xp = 0
			}
			if (lvl == null) {
				db.set(`lvl_${sid}_${uid}`, 1)
				lvl = 1
			}
			if (money == null) {
				db.set(`money_${sid}_${uid}`, 0)
				money = 0
			}

			const Embed = new MessageEmbed()
				.setColor('#ffffff')
				.setTitle(`**Профиль — ${user.username}`)
				.setThumbnail(`${user.displayAvatarURL()}`)
				.addFields(

					{ name: "уровень:", value: `${lvl}`, inline: true },
					{ name: "койнов:", value: `${money}`, inline: true },
					{ name: "был онлайн:", value: `online`, inline: true },
				)
			return interaction.reply({
				"content": null,
				"embeds": [Embed],
				"attachments": []
			});


		}


		let uid = interaction.user.id
		let sid = interaction.guild.id

		let money = db.get(`money_${sid}_${uid}`)
		let xp = db.get(`xp_${sid}_${uid}`)
		let lvl = db.get(`lvl_${sid}_${uid}`)
		if (!xp) {
			db.set(`xp_${sid}_${uid}`, 0)
			xp = 0
		}
		if (!lvl) {
			db.set(`lvl_${sid}_${uid}`, 1)
			lvl = 1
		}
		if (!money) {
			db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}


		const Embed = new MessageEmbed()
			.setColor('#ffffff')
			.setTitle(`Профиль — ${interaction.user.username}`)
			.setThumbnail(`${interaction.user.displayAvatarURL()}`)
			.addFields(

				{ name: "уровень:", value: `${lvl}`, inline: true },
				{ name: "койнов:", value: `${money}`, inline: true },
				{ name: "был онлайн:", value: `online`, inline: true },
			)
		return interaction.reply({
			"content": null,
			"embeds": [Embed],
			"attachments": []
		});





	}
}