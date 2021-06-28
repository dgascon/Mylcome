const Event = require('../../Structures/Event.js');
const hastebin = require("hastebin-gen");

module.exports = class extends Event {

	async run(member)
	{
		if (!this.client.jsonUtils.getKeyByGuild(member.guild.id, "removeauto"))
			return;
		const category = await member.guild.channels.cache.get(this.client.jsonUtils.getKeyByGuild(member.guild.id, "category"));
		await category.children.forEach(async channel => {
			const fetchMessages = await channel.messages.fetch({after:1, limit: 1});
			const message = fetchMessages.first();
			if (message.content)
			{
				let uid = message.content.match(/<@[!0-9]+>/).toString().replace(/[<@!>]/g, '');
				if (member.id === uid)
				{
					let save = this.client.jsonUtils.getKeyByGuild(message.guild.id, "save");
					if (save)
						save = member.guild.channels.cache.get(save);
					if (save !== undefined)
					{
						await channel.messages.fetch({limit: 100})
							.then(msg => {
								let log = "";
								msg = msg.array().reverse();
								for (let j = 0; j < msg.length; j++) {
									log += `${msg[j].author.tag} ${msg[j].createdAt.toString()}\n--\n`;
									log += `${msg[j].content}\n`
									log += `---------------------------------------------------------------------------------------------------------------\n`
								}

								hastebin(log, {extension: "txt"}).then(haste => {
									save.send(`Logs of ${channel.name} => ${haste}`).then(r => {
										channel.delete();
									})
								}).catch(error => {
									console.error(error);
								});
							})
					} else
						channel.delete();
				}
			}
		})


	}
}