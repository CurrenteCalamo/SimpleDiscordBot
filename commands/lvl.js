const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
let db = require('quick.db')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lvl')
		.setDescription('Показать мой текущий уровень'),
	async execute(interaction) {
		let uid = interaction.user.id
		let sid = interaction.guild.id

		let xp = await db.get(`xp_${sid}_${uid}`)
		if (!xp) {
			await db.set(`xp_${sid}_${uid}`, 0)
			xp = 0
		}

		let lvl = await db.get(`lvl_${sid}_${uid}`)
		if (!lvl) {
			await db.set(`lvl_${sid}_${uid}`, 1)
			lvl = 1
		}
		const embed = new MessageEmbed()
			.setTitle(`Текущий уровень — ${interaction.user.username}`)
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true })}`)
			.addFields(
				{ name: "уровень:", value: `${lvl}`, inline: true },
				{ name: "опыт:", value: `${xp}/30`, inline: true },
			)
		return await interaction.reply({
			embeds: [embed],
		})
	},
} 