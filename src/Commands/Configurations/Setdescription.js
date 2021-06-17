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
		this.client.jsonUtils.updateDataByGuild(message, "descriptions", args.join(' '));
		message.reply(`The text of canal is now \`${args.join(' ')}\``).then(r => r.delete({timeout: this.client.delete_time}));
	}
}