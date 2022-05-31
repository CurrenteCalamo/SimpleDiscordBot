const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
let db = require('quick.db')
const { getShopButtons, getShopList, } = require('../components')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Магазин ролей'),
	async execute(interaction) {

		const uid = interaction.user.id
		const sid = interaction.guild.id

		let page = 1
		let pages = 0
		let money = await db.get(`money_${sid}_${uid}`)
		if (!money) {
			await db.set(`money_${sid}_${uid}`, 0)
			money = 0
		}

		let myItems = await db.get('myItems')
		if (!myItems) {
			await db.set('myItems', [])
		}

		let tmppage = Math.floor((myItems.length) / 5) + 1
		const listRole = getShopList(myItems, 0)
		const byeButtons = getShopButtons(myItems, 0)


		const embed = new MessageEmbed()
			.setTitle(`Магазин личных ролей ${page}/${tmppage}`)
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
			.addFields(...listRole)

		const buttons = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel("Last")
				.setStyle("DANGER")
				.setCustomId("last")
				.setDisabled(page == 1 ? true : false),
			new MessageButton()
				.setLabel("Next")
				.setStyle("PRIMARY")
				.setCustomId("next")
				.setDisabled(page == tmppage ? true : false)
		)

		const collector = interaction.channel.createMessageComponentCollector({ time: 40000 })
		await interaction.reply({
			embeds: [embed],
			components: [buttons, byeButtons],
			ephemeral: true,
		})
		let tmp
		collector.on('collect', async i => {
			if (i.user.id !== interaction.user.id) return

			switch (i.customId) {
				case 'next': {
					page += 1
					pages += 4
					const buttons = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel("Last")
							.setStyle("DANGER")
							.setCustomId("last")
							.setDisabled(page == 1 ? true : false),
						new MessageButton()
							.setLabel("Next")
							.setStyle("PRIMARY")
							.setCustomId("next")
							.setDisabled(page == tmppage ? true : false)
					)
					const embed = new MessageEmbed()
						.setTitle(`Магазин личных ролей ${page}/${tmppage}`)
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.addFields(...getShopList(myItems, pages))

					return await interaction.editReply({
						embeds: [embed],
						components: [buttons, getShopButtons(myItems, pages)],
						ephemeral: true,
					})
				}
				case 'last': {
					page -= 1
					pages -= 4
					const buttons = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel("Last")
							.setStyle("DANGER")
							.setCustomId("last")
							.setDisabled(page == 1 ? true : false),
						new MessageButton()
							.setLabel("Next")
							.setStyle("PRIMARY")
							.setCustomId("next")
							.setDisabled(page == tmppage ? true : false)
					)
					const embed = new MessageEmbed()
						.setTitle(`Магазин личных ролей ${page}/${tmppage}`)
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.addFields(...getShopList(myItems, pages))

					return await interaction.editReply({
						embeds: [embed],
						components: [buttons, getShopButtons(myItems, pages)],
						ephemeral: true,
					})
				}
				case 'yes': {
					const role = myItems[tmp].role
					let amount = myItems[tmp].match
					if (money >= amount) {
						await db.set('myItems', myItems.filter(i => i !== myItems[tmp]))
						await i.member.roles.add(role.id)
						await db.set(`money_${sid}_${uid}`, money - amount)

						const embed = new MessageEmbed()
							.setTitle('Купить роль в магазине')
							.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
							.setDescription(`<@${interaction.user.id}>, Вы **купили** роль <@&${role.id}>`)
						return await interaction.editReply({
							embeds: [embed],
							components: [],
							ephemeral: true
						})
					} else {
						const embed = new MessageEmbed()
							.setTitle('Купить роль в магазине')
							.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
							.setDescription(`<@${interaction.user.id}>, у Вас недостаточно  <:durkas:975796782367907921> для покупки роли <@&${role.role.id}>. Необходимо ${amount - money}  <:durkas:975796782367907921>`)
						return await interaction.editReply({
							embeds: [embed],
							components: [],
							ephemeral: true
						})
					}
				}
				case 'not': {
					const role = myItems[tmp].role
					const embed = new MessageEmbed()
						.setTitle('Купить роль в магазине')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы **отменили** покупку роли <@&${role.id}>`)
					return await interaction.editReply({
						embeds: [embed],
						components: [],
						ephemeral: true
					})
				}
				default: {
					tmp = Number(i.customId)
					const role = myItems[tmp]
					let embedes = new MessageEmbed()
						.setTitle('Купить роль в магазине')
						.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
						.setDescription(`<@${interaction.user.id}>, Вы уверены, что хотите купить роль <@&${role.role.id}> за ${role.match}  <:durkas:975796782367907921>?`)
					const buttonse = new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel('cancel')
							.setStyle("DANGER")
							.setCustomId("not"),
						new MessageButton()
							.setLabel('yes')
							.setStyle("SUCCESS")
							.setCustomId("yes")
					)
					return await interaction.editReply({
						embeds: [embedes],
						components: [buttonse],
						ephemeral: true,
					})
				}
			}
		})
	}
}