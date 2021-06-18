const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['srroles'],
			description: 'This define the roles which will be deleted',
			usage: 'srroles [roles...]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		let roles = [];
		args.forEach(r => {
			let parsedRole = r.replace(/[^0-9.]+/g, '');
			let role = message.guild.roles.cache.find(x => x.id === parsedRole);
			if (role !== undefined) {
				roles.push(parsedRole);
			}
		})

		this.client.jsonUtils.updateDataByGuild(message.guild.id, "removeroles", roles);
		let text = '';
		roles.forEach(r => {
			text += `<@&${r}> `;
		})
		message.reply(`The remove roles are now ${text}`).then(r => r.delete({timeout: this.client.delete_time}));
	}
}