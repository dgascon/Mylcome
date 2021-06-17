const fs = require('fs');

module.exports = class JsonUtils
{
	constructor(client) {
		this.client = client;
	}

	/**
	 * Read and parse guild_config file
	 * @returns Object JSON
	 */
	getReadParseConf() {
		try {
			return JSON.parse(fs.readFileSync(this.client.config, 'utf-8'));
		} catch (e) {
			fs.writeFileSync(this.client.config, JSON.stringify([]), 'utf-8');
			return JSON.parse(fs.readFileSync(this.client.config, 'utf-8'));
		}
	}

	/**
	 * Get data by Guild
	 * @param message
	 * @returns {boolean|*} false if doesn't exist or data.
	 */
	getDataByGuild(message) {
		let fileConf = this.getReadParseConf();

		try {
			for (let i = 0; i < fileConf.length; i++) {
				if (fileConf[i].guild_id !== message.guild.id)
					continue;
				return fileConf[i];
			}
		} catch (e) {
			return false;
		}
	}

	/**
	 * Update data by guild
	 * @param message
	 * @param nameData Key
	 * @param valueData Value
	 */
	updateDataByGuild(message, nameData, valueData)
	{
		let dataFile = this.getReadParseConf();
		let isExist = false;

		for (let i = 0; i < dataFile.length; i++) {
			if (dataFile[i].guild_id !== message.guild.id)
				continue;
			dataFile[i][nameData] = valueData;
			isExist = true;
		}

		if (!isExist)
			dataFile.push({"guild_id": message.guild.id, [nameData]: valueData});
		fs.writeFileSync(this.client.config, JSON.stringify(dataFile), "utf-8");
	}

	/**
	 * Get value by key on guild
	 * @param message
	 * @param nameData key
	 * @returns {boolean|*} false if doesn't exist
	 */
	getKeyByGuild(message, nameData)
	{
		let dataFile = this.getDataByGuild(message);

		if (dataFile[nameData] !== undefined)
			return dataFile[nameData];
		return false;
	}
}