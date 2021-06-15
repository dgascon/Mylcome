const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event.js');
const fs = require('fs');

/**
 * Function util for the bot
 * @type {Util}
 */
module.exports = class Util {
	constructor(client) {
		this.client = client;
	}

	/**
	 * Check if input is a Class
	 * @param input is a file
	 * @returns {boolean} true if input is a class else false
	 */
	isClass(input) {
		return typeof input === 'function'
			&& typeof input.prototype === 'object'
			&& input.toString().substring(0, 5) === 'class';
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

	updateDataByGuild(message, nameData, valueData)
	{
		let dataFile = this.client.utils.getReadParseConf();
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

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	/**
	 * Reture absolute path
	 * @returns {string}
	 */
	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	/**
	 * Return the string with the first letter to uppercase
	 * @param string
	 * @returns {string}
	 */
	capitalise(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
	}

	/**
	 * Loads the commands contained in the "Commands" folder
	 * @returns {Promise<void>}
	 */
	async loadCommand() {
		return glob(`${this.directory}Commands/**/*.js`).then(commands => {
			for (const commandFile of commands)
			{
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in commands.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length)
				{
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	/**
	 * Lods the commands contained in the "Events" folder
	 * @returns {Promise<void>}
	 */
	async loadEvents()
	{
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events)
			{
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name.toLowerCase());
				if (!(event instanceof  Event)) throw new TypeError(`Event ${name} doesn't belong in events.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		})
	}
}
