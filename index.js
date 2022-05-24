const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { msgInteraction, timeCounter, randomRoom, setUserLvl, privateRoom, personlRoom, lol } = require('./helper');
const { GuildVerificationLevel } = require('discord-api-types/v10');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_PRESENCES]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

});

client.on('guildMemberAdd', (member) => {
	member.send("Welcome!");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageDelete', (message) => {
	let files = []
	for (let val of message.attachments) files.push(val[1].proxyURL)
	const Embed = msgInteraction(message)
	client.channels.cache.get("972184647201062932").send({ files: files, embeds: [Embed] })

})
client.on('messageUpdate', (message) => {
	let files = []
	for (let val of message.attachments) files.push(val[1].proxyURL)
	const Embed = msgInteraction(message)
	client.channels.cache.get("974257431897051146").send({ files: files, embeds: [Embed] })
})


client.on("voiceStateUpdate", (oldMember, newMember) => {

	timeCount(oldMember, newMember)
	randomRoom(oldMember, newMember)
	privateRoom(oldMember, newMember)
	personlRoom(oldMember, newMember)

})
client.on('message', async (message) => {
	setUserLvl(message)
})


// 


client.login(token);