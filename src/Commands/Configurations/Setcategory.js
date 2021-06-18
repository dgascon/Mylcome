const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['scategory'],
			description: 'This define the category of canal',
			usage: 'scategory [name_of_category]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		let category = message.guild.channels.cache.find(x => x.id === args[0] && x.type === "category");
		if (!category) {
			message.reply(`The category doesn't exist !`).then(r => r.delete({timeout: this.client.delete_time}));
			return;
		}

		this.client.jsonUtils.updateDataByGuild(message.guild.id, "category", args[0]);
		message.reply(`The category is now <#${args[0]}>`).then(r => r.delete({timeout: this.client.delete_time}));
	}
}