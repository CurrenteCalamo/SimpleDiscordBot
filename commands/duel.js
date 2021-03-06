const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
let db = require('quick.db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("duel")
        .setDescription("Вызвать на дуэль")
        .addIntegerOption(option => option.setName('amount').setDescription('Укажите вашу ставку')),
    execute: async (interaction) => {
        const amount = interaction.options.getInteger('amount')

        const uid = interaction.user.id
        const sid = interaction.guild.id

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
                content: `<@${interaction.user.id}>, **Минимальна** ставка **50**<:durkas:975796782367907921>`,
                ephemeral: true
            })
        if (!amount)
            return await interaction.reply({
                content: `<@${interaction.user.id}>, **Минимальна** ставка **50**<:durkas:975796782367907921>`,
                ephemeral: true
            })

        const embed = new MessageEmbed()
            .setTitle('Дуэли')
            .setDescription(`<@${interaction.user.id}>, хочет с кем-то сразиться на ${amount} <:durkas:975796782367907921>`)
            .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Cразится")
                .setStyle("SUCCESS")
                .setCustomId("paper")
        )

        const collector = interaction.channel.createMessageComponentCollector({ max: 1, time: 20000 })
        await interaction.reply({
            embeds: [embed],
            components: [buttons],
        })

        setTimeout(() => {
            return interaction.deleteReply()
        }, 25000)


        collector.on('collect', async i => {
            if (i.user.id == interaction.user.id) return

            let eid = i.user.id
            let emoney = await db.get(`money_${sid}_${eid}`)
            if (!emoney) {
                await db.set(`money_${sid}_${eid}`, 0)
                emoney = 0
            }

            if (emoney < amount) return


            if (Math.floor(Math.random() * 10) >= 5) {
                const embed = new MessageEmbed()
                    .setTitle('Дуэли')
                    .setDescription(`В **дуэли** одержал **победу** <@${i.user.id}> и **получил** ${amount} <:durkas:975796782367907921>`)
                    .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
                await db.set(`money_${sid}_${eid}`, emoney + amount)
                await db.set(`money_${sid}_${uid}`, money - amount)

                return await interaction.editReply({
                    embeds: [embed],
                    components: []
                })
            } else {
                const embed = new MessageEmbed()
                    .setTitle('Дуэли')
                    .setDescription(`В **дуэли** одержал **победу** <@${interaction.user.id}> и **получил** ${amount} <:durkas:975796782367907921>`)
                    .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)

                await db.set(`money_${sid}_${eid}`, emoney - amount)
                await db.set(`money_${sid}_${uid}`, money + amount)

                return await interaction.editReply({
                    embeds: [embed],
                    components: []
                })
            }
        })
    },
}

