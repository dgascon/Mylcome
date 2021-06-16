const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sname'],
			description: 'This define the name of canal ({user} = username)',
			usage: 'sname [name_of_canal]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		let text = args.join(' ');

		if (text.length < 1 || text.length > 100)
		{
			message.reply(`The name of canal must contains between 1 and 100 character !`).then(r => r.delete({timeout: this.client.delete_time}));
			return;
		}
		this.client.utils.updateDataByGuild(message, "name", args.join(' '));
		message.reply(`The name of canal is now \`${args.join(' ')}\``).then(r => r.delete({timeout: this.client.delete_time}));
	}
}