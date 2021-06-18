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
	 * @param id
	 * @returns {boolean|*} false if doesn't exist or data.
	 */
	getDataByGuild(id) {
		let fileConf = this.getReadParseConf();

		try {
			for (let i = 0; i < fileConf.length; i++) {
				if (fileConf[i].guild_id !== id)
					continue;
				return fileConf[i];
			}
		} catch (e) {
			return false;
		}
	}

	/**
	 * Update data by guild
	 * @param id
	 * @param nameData Key
	 * @param valueData Value
	 */
	updateDataByGuild(id, nameData, valueData)
	{
		let dataFile = this.getReadParseConf();
		let isExist = false;

		for (let i = 0; i < dataFile.length; i++) {
			if (dataFile[i].guild_id !== id)
				continue;
			dataFile[i][nameData] = valueData;
			isExist = true;
		}

		if (!isExist)
			dataFile.push({"guild_id": id, [nameData]: valueData});
		fs.writeFileSync(this.client.config, JSON.stringify(dataFile), "utf-8");
	}

	/**
	 * Get value by key on guild
	 * @param id
	 * @param nameData key
	 * @returns {boolean|*} false if doesn't exist
	 */
	getKeyByGuild(id, nameData)
	{
		let dataFile = this.getDataByGuild(id);

		try {
			return dataFile[nameData];
		} catch (e) {
			return false;
		}
	}
}