const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event.js');

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

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	/**
	 * Replace variable in text
	 * @param member
	 * @param text
	 * @returns {*}
	 */
	parsedTextByVariable(member, text)
	{
		let tx;
		tx = text.replace(/{user}/g, member.user.username);
		tx = tx.replace(/{usertag}/g, `<@${member.user.id}>`);
		return tx;
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
