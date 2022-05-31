const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
let db = require('quick.db')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Отправить койны выбранному пользователю')
		.addUserOption(option => option.setName('target').setDescription('Пользователь'))
		.addIntegerOption(option => option.setName('amount').setDescription('Сумма перевода')),
	async execute(interaction) {
		const user = interaction.options.getUser('target')
		const amount = interaction.options.getInteger('amount')

		const uid = interaction.user.id
		const sid = interaction.guild.id

		const fid = user.id
		let fmoney = await db.get(`money_${sid}_${fid}`)
		if (!fmoney) {
			await db.set(`money_${sid}_${fid}`, 0)
			fmoney = 0
		}

		let money = await db.get(`money_${sid}_${uid}`)
		if (!money) {
			await db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		if (money < amount)
			return await interaction.reply({
				content: `<@${interaction.user.id}>, **У** вас **недостаточно ${amount - money}** <:durkas:975796782367907921>`,
				ephemeral: true
			})
		if (!(amount >= 50))
			return await interaction.reply({
				content: `<@${interaction.user.id}>, **Минимальна** сумма **50**<:durkas:975796782367907921>`,
				ephemeral: true
			})
		if (!amount)
			return await interaction.reply({
				content: `<@${interaction.user.id}>, **Минимальна** сумма **50**<:durkas:975796782367907921>`,
				ephemeral: true
			})

		if (user) {
			await db.set(`money_${sid}_${uid}`, money - amount)
			await db.set(`money_${sid}_${fid}`, fmoney + Math.floor(amount * 0.96))

			const embed = new MessageEmbed()
				.setTitle('Передача валюты')
				.setDescription(`<@${interaction.user.id}>,  Вы **передали** пользователю <@${user.id}> ${amount} <:durkas:975796782367907921>, включая комиссию 4%`)
				.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
			return await interaction.reply({
				embeds: [embed],
			})
		} else {
			return await interaction.reply({
				content: `<@${interaction.user.id}>, У **вас** недостаточно **койнов!**`,
				ephemeral: true
			})
		}
	},
} 