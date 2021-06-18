const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sreact'],
			description: 'This define the reactions of message (sep = ", ") [close = suppress chan]',
			usage: 'sreact [emoji role, ...]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		let group = args.join(' ').split(', ');
		let groupKV = [];

		for (let i = 0; i < group.length; i++) {
			let splitgroup = group[i].split(' ');
			if (splitgroup.length < 2) {
				message.reply("Your command is not correct..").then(r => r.delete({timeout: this.client.delete_time}));
				return ;
			}
			for (let j = 1; j < splitgroup.length; j++) {
				if (splitgroup[j] !== "close") {
					splitgroup[j] = splitgroup[j].replace(/[^0-9.]+/g, '');
					let role = message.guild.roles.cache.find(x => x.id === splitgroup[j]);
					if (role === undefined) {
						message.reply("The role doesn't exist..").then(r => r.delete({timeout: this.client.delete_time}));
						return;
					}
				}
			}

			groupKV.push(splitgroup);
		}

		this.client.jsonUtils.updateDataByGuild(message.guild.id, "react", groupKV);
		message.reply(`The react of canal is set`).then(r => r.delete({timeout: this.client.delete_time}));
	}
}