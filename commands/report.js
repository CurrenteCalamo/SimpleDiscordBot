const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Жалоба на участника сервера Currente Calamo.')
		.addUserOption(option => option.setName('user').setDescription('Пользователь который нарушил правила.'))
		.addStringOption(option => option.setName('message').setDescription('Описания нарушения.')),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const message = interaction.options.getString('message');
		if (user && message) {
			interaction.guild.channels.cache.get("973998435285999707").send(`Жалоба [<@${interaction.user.id}>] на [<@${user.id}>] причина [${message}]`)
			return interaction.reply(`**Жалоба отправлена!** `);
		}

		return interaction.reply(`**Пожалуйста** заполните **все поля!**`);
	},
};