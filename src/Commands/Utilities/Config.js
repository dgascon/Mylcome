const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['conf'],
			description: 'This provides the current configuration of bot for this guild',
			category: 'Utilities'
		});
	}

	async run(message) {
		let data = this.client.jsonUtils.getDataByGuild(message);

		const embed = new MessageEmbed()
		embed.setColor('#0099ff')
		embed.setTitle('Configuration')
		embed.setTimestamp()
		if (data)
		{
			for (var item in data)
			{
				embed.addField(item, data[item], false);
			}
		}
		else
		{
			embed.setDescription("**No config for the guild**");
		}
		message.reply(embed).then(r => r.delete({timeout: this.client.delete_time}));
	}
}