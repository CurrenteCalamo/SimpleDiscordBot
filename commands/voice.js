const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
let db = require('quick.db')
const { getTimeStr } = require('../components.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Показать мое время онлайн'),
	async execute(interaction) {
		const uid = interaction.user.id

		let allTime = await db.get(`voiceAllTime.${uid}`)
		if (!allTime) {
			await db.set(`voiceAllTime.${uid}`, 0)
			allTime = 0
		}

		let dayTime = await db.get(`voiceDayTime.${uid}`)
		if (!dayTime) {
			await db.set(`voiceDayTime.${uid}`, 0)
			dayTime = 0
		}

		let todayTime = new Date()
		var dd = String(todayTime.getDate()).padStart(2, '0')
		var mm = String(todayTime.getMonth() + 1).padStart(2, '0')
		var yyyy = todayTime.getFullYear()
		todayTime = mm + dd + yyyy

		let lastTime = await db.get(`voiceLastTime`)
		if (!lastTime) {
			await db.set(`voiceLastTime`, 0)
			lastTime = 0
		}

		if (lastTime < todayTime) {
			await db.set(`voiceLastTime`, Number(todayTime))
			await db.set(`voiceDayTime.${uid}`, 0)
			dayTime = 0
		}

		const embed = new MessageEmbed()
			.setTitle(`Голосовой онлайн — ${interaction.user.username}`)
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
			.addFields(
				{ name: "За сутки", value: getTimeStr(dayTime), inline: true },
				{ name: "За всё время", value: getTimeStr(allTime), inline: true },
			)

		return await interaction.reply({
			embeds: [embed],
		})
	},
} 