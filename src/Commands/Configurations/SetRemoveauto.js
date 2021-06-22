const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['srauto'],
			description: 'This define the remove automatic of channel when a user left a server',
			usage: 'srauto [true/false/1/0]',
			category: 'Configurations'
		});
	}

	async run(message, args) {
		if (args.length !== 1) {
			message.reply(`Bad argument`).then(r => r.delete({timeout: this.client.delete_time}));
			return;
		}

		let flag = true;
		let arg = args[0].toLowerCase();

		if (arg === "true" || arg === "1")
			flag = true;
		else if (arg === "false" || arg === "0")
			flag = false;
		else
		{
			message.reply(`Bad argument !`).then(r => r.delete({timeout: this.client.delete_time}));
			return;
		}
		this.client.jsonUtils.updateDataByGuild(message.guild.id, "removeauto", flag);
		message.reply(`The remove auto of channel is now at ${flag}`).then(r => r.delete({timeout: this.client.delete_time}));
	}
}