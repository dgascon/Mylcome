const Event = require('../../Structures/Event.js');

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
					channel.delete();
				}
			}
		})


	}
}