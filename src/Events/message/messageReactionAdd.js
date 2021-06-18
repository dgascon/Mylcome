const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	async run(messageReaction, user) {
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
			for (var key in react)
			{
				emojiReact.push(react[key][0]);
			}

			if (emojiReact.includes(emoji) && message.author.id == this.client.user.id)
			{
				const uidextract = message.content.match(RegExp(`<@[0-9]+>`))[0];
				const uid = uidextract.substr(2, uidextract.length - 3);
				const user = message.guild.members.cache.get(uid);
				for (var key in react)
				{
					if (emoji === react[key][0]) {
						if (react[key][1] === "close") {
							await this.client.channels.cache.get(message.channel.id).delete("Finished");
							return;
						}
						else {
							for (let i = 1; i < react[key].length; i++) {
								await user.roles.add(react[key][i]);
							}
						}
					}
				}

				let rroles = this.client.jsonUtils.getKeyByGuild(message.guild.id, "removeroles");
				if (rroles)
				{
					for (let i = 0; i < rroles.length; i++) {
						await user.roles.remove(rroles[i]);
					}
				}
				await this.client.channels.cache.get(message.channel.id).delete("Finished");
			}
		}
	}
}