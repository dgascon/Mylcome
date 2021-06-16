const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sroles'],
			description: 'This define the roles',
			usage: 'sroles [roles...]',
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

		this.client.utils.updateDataByGuild(message, "autoroles", roles);
		let text = '';
		roles.forEach(r => {
			text += `<@&${r}> `;
		})
		message.reply(`The roles are now ${text}`).then(r => r.delete({timeout: this.client.delete_time}));
	}
}