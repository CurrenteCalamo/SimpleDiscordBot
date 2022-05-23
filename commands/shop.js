

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
let db = require('quick.db')
const { lock } = require('../config.json');
const { helperlol, helperlol2 } = require('../helper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Создать пользовательскую роль!')
	,
	async execute(interaction) {
		let page = 0
		let pages = 4
		const myItems = db.get('myItems')
		if (!myItems) {
			db.set('myItems', [])
		}
		// let uid = interaction.user.id
		// let sid = interaction.guild.id
		// let money = db.get(`money_${sid}_${uid}`)
		// if (money == null) {
		// 	db.set(`money_${sid}_${uid}`, 0)
		// 	money = 0
		// }
		// let tmp = myItems.length
		const lol = helperlol(myItems, 0)
		const lol2 = helperlol2(myItems, 0)
		const embed = new MessageEmbed()
			.setColor('#ffffff')
			.setTitle('Магазин личных ролей')
			.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)

			.addFields(
				...lol
			)
		const buttons = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel("last")
				.setStyle("DANGER")
				.setCustomId("last")
				.setDisabled(true),
			new MessageButton()
				.setLabel("Next")
				.setStyle("PRIMARY")
				.setCustomId("next")
				.setDisabled(false),

		);



		const collector = interaction.channel.createMessageComponentCollector({ time: 50000 });
		await interaction.reply({
			embeds: [embed],
			components: [buttons, lol2],
		})
		setTimeout(() => {
			interaction.deleteReply();
		}, 50000);

		collector.on('collect', async i => {
			// if (i.user.id !== uid) return
			let buttonse

			let tmps
			let buttonss
			let embeds
			if (i.customId == 'next') {
				buttonse = new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel("last")
						.setStyle("DANGER")
						.setCustomId("last")
						.setDisabled(pages == 0),
					new MessageButton()
						.setLabel("Next")
						.setStyle("PRIMARY")
						.setCustomId("next")
						.setDisabled(pages < myItems.length),

				);
				tmps = helperlol(myItems, pages)
				embeds = new MessageEmbed()
					.setColor('#ffffff')
					.setTitle('Магазин личных ролей')
					.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)

					.addFields(
						...tmps
					)
				buttonss = helperlol2(myItems, pages)
				pages += 4
				i.update({
					embeds: [embeds],
					components: [buttonse, buttonss],
				})
			} else if (i.customId == 'last') {
				console.log(pages >= myItems.length)
				pages -= 4
				buttonse = new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel("last")
						.setStyle("DANGER")
						.setCustomId("last")
						.setDisabled(pages == 0),
					new MessageButton()
						.setLabel("Next")
						.setStyle("PRIMARY")
						.setCustomId("next")
						.setDisabled(pages >= myItems.length),

				);

				tmps = helperlol(myItems, pages)
				embeds = new MessageEmbed()
					.setColor('#ffffff')
					.setTitle('Магазин личных ролей')
					.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)

					.addFields(
						...tmps
					)
				buttonss = helperlol2(myItems, pages)
				i.update({
					embeds: [embeds],
					components: [buttonse, buttonss],
				})
			} else {
				i.update({
					embeds: [],
					components: [buttonse, buttonss],
				})
				// await interaction.followUp({ content: `These buttons aren't for you!`, ephemeral: true })
				// let embedes = new MessageEmbed()
				// 	.setColor('#ffffff')
				// 	.setTitle('Купить роль в магазине')
				// 	.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				// 	.setDescription(`<@${interaction.user.id}>, Вы уверены, что хотите купить роль <@&${myItems[i.customId].role.id}> за ${myItems[i.customId].match} ? Роли покупаются на 7 дней, после чего Вам придется купить ее заново`)

				// let embededs = new MessageEmbed()
				// 	.setColor('#ffffff')
				// 	.setTitle('Купить роль в магазине')
				// 	.setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
				// 	.setDescription(`<@${interaction.user.id}>, у Вас недостаточно :coin: для покупки роли <@&${myItems[i.customId].role.id}> за ${myItems[i.customId].match} ? Роли покупаются на 7 дней, после чего Вам придется купить ее заново`)
			}



		});


	},
}