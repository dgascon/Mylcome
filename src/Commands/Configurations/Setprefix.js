const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sprefix'],
			description: 'This definie the prefix for the guild',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		this.client.utils.updateDataByGuild(message, "prefix", args[0]);
		message.reply(`Your prefix is now \`${args[0]}\``).then(r => r.delete({timeout: this.client.delete_time}));
	}
}