const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sdesc'],
			description: 'This define the description of canal ({user} = username)',
			usage: 'sdesc [text]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		args = args.join(' ');

		if (args.length >= 1900) {
			args = args.substr(0, 1897);
			args = args + "...";
		}

		this.client.jsonUtils.updateDataByGuild(message.guild.id, "descriptions", args);
		message.reply(`The text of canal is now \`${args}\``).then(r => r.delete({timeout: this.client.delete_time}));
	}
}