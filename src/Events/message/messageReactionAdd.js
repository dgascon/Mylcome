const Event = require('../../Structures/Event.js');
const fs = require('fs');

module.exports = class extends Event {

	async run(messageReaction, user) {
		if (messageReaction.partial) {
			try {
				await messageReaction.fetch();
			} catch (error) {
				return;
			}
		}
		const message = messageReaction.message;
		const member = message.guild.members.cache.get(user.id);
		const emoji = messageReaction.emoji.name;

		if (member.user.bot || !member.hasPermission("KICK_MEMBERS")) return;

		this.arrivedReact(message, emoji);
	}

	async arrivedReact(message, emoji)
	{
		let react = this.client.jsonUtils.getKeyByGuild(message.guild.id, "react");
		let emojiReact = [];

		if (react)
		{
			for (var k in react)
			{
				emojiReact.push(react[k][0]);
			}
			if (emojiReact.includes(emoji) && message.author.id === this.client.user.id)
			{
				const uidextract = message.content.match(RegExp(`<@[0-9]+>`))[0];
				const uid = uidextract.substr(2, uidextract.length - 3);
				const user = message.guild.members.cache.get(uid);

				for (var key in react)
				{
					if (emoji === react[key][0]) {
						for (let i = 1; i < react[key].length; i++) {
							if (react[key][i] === "close")
							{
								if (user !== undefined) {
									let rroles = this.client.jsonUtils.getKeyByGuild(message.guild.id, "removeroles");
									if (rroles) {
										for (let i = 0; i < rroles.length; i++) {
											await user.roles.remove(rroles[i]);
										}
									}
								}
								let save = this.client.jsonUtils.getKeyByGuild(message.guild.id, "save");
								if (save)
									save = message.guild.channels.cache.get(save);
								if (save !== undefined)
								{
									await message.channel.messages.fetch({limit: 100})
										.then(msg => {
											let log = "";
											msg = msg.array().reverse();
											for (let j = 0; j < msg.length; j++) {
												log += `${msg[j].author.tag} ${msg[j].createdAt.toString()}\n--\n`;
												log += `${msg[j].content}\n`
												log += `---------------------------------------------------------------------------------------------------------------\n`
											}

											let name = `./logs/logs-of-${message.channel.name}.txt`;
											fs.writeFile(name, log, (err) => {
												if (err) throw new Error("File doesn't create");
												save.send(`Logs of ${message.channel.name}`, {files: [name]}).then(r => {
														fs.unlinkSync(name);
														message.channel.delete();
												})
											});
										})
								} else
									message.channel.delete("Finished");
								return;
							}
							else {
								if (user !== undefined)
									await user.roles.add(react[key][i]);
								else {
									message.channel.send('The user has left the server !');
									return
								}
							}
						}
					}
				}
			}
		}
	}
}