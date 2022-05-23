const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} = require("discord.js");
let db = require('quick.db')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("duel")
        .setDescription("Вызвать на дуэль в камень - ножницы - бумага")
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to prune')),

    execute: async (interaction) => {











        let amount = interaction.options.getInteger('amount');
        // if (amount < 50 && !amount) return interaction.reply(`**<@${interaction.user.id}> Минимальна ставка 50 **<:durkas:975796782367907921>`)
        let uid = interaction.user.id
        let sid = interaction.guild.id
        let money = db.get(`money_${sid}_${uid}`)
        if (!money) {
            db.set(`money_${sid}_${uid}`, 0)
            money = 0
        }
        if (money < amount) return interaction.reply(`<@${interaction.user.id}>** У вас недостаточно ${amount - money} койнов!**`)
        const embed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle('Дуэли')
            .setDescription(`<@${interaction.user.id}>, хочет с кем-то сразиться на ${amount} <:durkas:975796782367907921>`)
            .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Дуель")
                .setStyle("SUCCESS")
                .setCustomId("paper")
        );
        const filter = i => i.customId === 'paper';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        await interaction.reply({
            embeds: [embed],
            components: [buttons],
        })
        setTimeout(() => {
            interaction.deleteReply();

        }, 15000);


        collector.on('collect', async i => {

            let fid = i.user.id
            let fmoney = db.get(`money_${sid}_${uid}`)
            if (!fmoney) {
                db.set(`money_${sid}_${uid}`, 0)
                fmoney = 0
            }
            if (fmoney > amount) {
                return
            }
            let roll = Math.floor(Math.random() * 10)


            const embedwin = new MessageEmbed()
                .setColor('#ffffff')
                .setTitle('Дуэли')
                .setDescription(`В дуэли одержал победу <@${i.user.id}> и получил ${amount} <:durkas:975796782367907921>`)
                .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
            const embedlose = new MessageEmbed()
                .setColor('#ffffff')
                .setTitle('Дуэли')
                .setDescription(`В дуэли одержал победу <@${interaction.user.id}> и получил ${amount} <:durkas:975796782367907921>`)
                .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: false })}`)
            if (roll >= 5) {
                db.set(`money_${sid}_${fid}`, fmoney + amount)
                db.set(`money_${sid}_${uid}`, money - amount)
                await i.update({ embeds: [embedwin], components: [] });
            } else {
                db.set(`money_${sid}_${fid}`, fmoney - amount)
                db.set(`money_${sid}_${uid}`, money + amount)
                await i.update({ embeds: [embedlose], components: [] });
            }




        });


    },

};

