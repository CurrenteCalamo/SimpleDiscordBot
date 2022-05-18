const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Display info about yourself.'),
	async execute(interaction) {
		return interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
	},
	// var today = new Date();
	// var dd = String(today.getDate()).padStart(2, '0');
	// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	// var yyyy = today.getFullYear();

	// today = mm + dd + yyyy;
	// let lastday = db.get(`lastDay`)
	// if (!lastday) {
	// 	db.set(`lastDay`, Number(today) - 1)
	// 	lastday = today + 1
	// }
	// if (lastday < today) {
	// 	db.set(`lastDay`, Number(today))
	// 	db.set(`voiceAllTime.${oldMember.member.id}`, 0)
	// }
};