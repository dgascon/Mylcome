const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	async run(member)
	{
		let name = this.client.jsonUtils.getKeyByGuild(member.guild.id, "name");
		let category = this.client.jsonUtils.getKeyByGuild(member.guild.id, "category");
		let roles = this.client.jsonUtils.getKeyByGuild(member.guild.id, "autoroles");
		let desc = this.client.jsonUtils.getKeyByGuild(member.guild.id, "descriptions");
		let react = this.client.jsonUtils.getKeyByGuild(member.guild.id, "react");

		if (!category)
		{
			await member.guild.channels.create("Welcome", {
				type: 'category',
				permissionOverwrites: [
					{
						id: member.guild.roles.everyone.id,
						deny: ['VIEW_CHANNEL']
					}
				]
			}).then(r => {
					category = r.id;
					this.client.jsonUtils.updateDataByGuild(member.guild.id, "category", r.id);
				})
		}

		(!name) ? name = 'Channel of {user}' : 0;
		if (!desc)
			desc = `<@${member.id}>`
		else
			desc = `<@${member.id}>` + desc;


		member.guild.channels.create(this.client.utils.parsedTextByVariable(member, name), {
			type: 'text',
			parent: category
		})
			.then(async chan => {
				setTimeout(() => chan.updateOverwrite(member.id, {VIEW_CHANNEL: true}), 1000);
				if (roles) setTimeout(() => member.roles.add(roles), 1100);
				if (desc) setTimeout(() => {
					chan.send(this.client.utils.parsedTextByVariable(member, desc))
						.then(r => {
							if (react)
							{
								for (var key in react)
								{
									r.react(react[key][0]);
								}
							}
						})
				}, 1500)
			})
			.catch(console.error);
	}
}