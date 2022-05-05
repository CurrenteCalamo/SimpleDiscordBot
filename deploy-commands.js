const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('avatar').setDescription('Get the avatar URL of the selected user, or your own avatar.'),
	new SlashCommandBuilder().setName('beep').setDescription('Beep!'),
	new SlashCommandBuilder().setName('kick').setDescription('Select a member and kick them (but not really).'),
	new SlashCommandBuilder().setName('options-info').setDescription('Information about the options provided.'),
	new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	new SlashCommandBuilder().setName('prune').setDescription('Prune up to 99 messages.'),
	new SlashCommandBuilder().setName('server').setDescription('Display info about this server.'),
	new SlashCommandBuilder().setName('user-info').setDescription('Display info about yourself.'),
]

	.map(command => command.toJSON());
console.log(commands)
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId),
	{ body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);