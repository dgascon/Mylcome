const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ssave'],
			description: 'This define the canal which will receive the logs',
			usage: 'ssave [name_of_chan]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		let category = message.guild.channels.cache.find(x => x.id === args[0] && x.type === "text");
		if (!category) {
			message.reply(`The channel doesn't exist !`).then(r => r.delete({timeout: this.client.delete_time}));
			return;
		}

		this.client.jsonUtils.updateDataByGuild(message.guild.id, "save", args[0]);
		message.reply(`The channel of save is now <#${args[0]}>`).then(r => r.delete({timeout: this.client.delete_time}));
	}
}