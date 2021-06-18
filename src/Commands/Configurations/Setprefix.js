const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sprefix'],
			description: 'This define the prefix for the guild',
			usage: 'sprefix [new_prefix]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		this.client.jsonUtils.updateDataByGuild(message.guild.id, "prefix", args[0]);
		message.reply(`Your prefix is now \`${args[0]}\``).then(r => r.delete({timeout: this.client.delete_time}));
	}
}