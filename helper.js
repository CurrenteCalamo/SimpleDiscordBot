let db = require('quick.db')
const { rooms } = require('./config.json');

function msgInteraction(message) {
	let files = []
	for (let val of message.attachments) files.push(val[1].proxyURL)
	const Embed = new MessageEmbed()
		.setColor('#ffffff')
		.addField('Отправитель', message.member.toString())
		.addField('Канал', message.channel.toString(), true)
		.addField('Содержание', message.content ? message.content : 'null', true)
		.setTimestamp()
	client.channels.cache.get("974257431897051146").send({ files: files, embeds: [Embed] })
}

function timeCounter(oM, nM) {
	if (!oM.channel && nM.channel) {

		let tmpTime = db.get(`voiceTmpTime.${nM.member.id}`)
		if (!tmpTime)
			db.set(`voiceTmpTime.${nM.member.id}`, Date.now())

		let allTime = db.get(`voiceAllTime.${nM.member.id}`)
		if (!allTime)
			db.set(`voiceAllTime.${nM.member.id}`, 0)

		let dayTime = db.get(`voiceAllTime.${nM.member.id}`)
		if (!dayTime)
			db.set(`voiceDayTime.${nM.member.id}`, 0)

	} else if (!nM.channel) {
		var endTime = Date.now();
		let tmpTime = db.get(`voiceTmpTime.${nM.member.id}`)
		if (!tmpTime) return;

		let time = endTime - tmpTime;

		db.add(`voiceAllTime.${oM.member.id}`, time);
		db.add(`voiceDayTime.${oM.member.id}`, time);
		db.add(`voiceTmpTime.${oM.member.id}`, null);
	}
}
function randomRoom(oM, nM) {
	if (nM.channel && nM.channel.name.startsWith('┌random')) {
		nM.setChannel(rooms[(Math.floor(Math.random() * 49))])
	}
}
function personlRoom(oM, nM) {
	if (nM.channel != null && nM.channel.name.startsWith('├personal')) {
		nM.guild.channels.create(nM.member.user.username, {
			type: 'GUILD_VOICE',
			parent: '972491122981077012',


		}).then(cloneChannel => nM.setChannel(cloneChannel))

	}
}

module.exports = { msgInteraction, timeCounter, randomRoom, personlRoom }