const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "5.0",
		author: "NeoKEX",
		shortDescription: "Show all available commands",
		longDescription: "Displays a clean and premium-styled categorized list of commands.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		const cleanCategoryName = (text) => {
			if (!text) return "others";
			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(cmd.config.category);
			if (!categories[cat]) categories[cat] = [];
			categories[cat].push(cmd.config.name);
		}

		if (args[0]) {
			const query = args[0].toLowerCase();
			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find((c) => (c.config.aliases || []).includes(query));
			
			if (!cmd) return message.reply(`❌ Command "${query}" not found.`);

			const {
				name,
				version,
				author,
				guide,
				category,
				shortDescription,
				longDescription,
				aliases
			} = cmd.config;

			const desc = typeof longDescription === "string" ? longDescription : (longDescription?.en || shortDescription?.en || shortDescription || "No description");
			const usage = typeof guide === "string" ? guide.replace(/{pn}/g, prefix) : (guide?.en?.replace(/{pn}/g, prefix) || `${prefix}${name}`);
			const requiredRole = cmd.config.role !== undefined ? cmd.config.role : 0; 

			return message.reply(
				`⛩️ ——— 『 𝗖𝗠𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 』 ——— ⛩️\n` +
				`━━━━━━━━━━━━━━━━━━━━━\n` +
				`┃ ✧ 𝐍𝐚𝐦𝐞: ${name}\n` +
				`┃ ✧ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${version}\n` +
				`┃ ✧ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${category.toUpperCase()}\n` +
				`┃ ✧ 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: ${requiredRole === 0 ? "User" : requiredRole === 1 ? "Admin" : "Owner"}\n` +
				`┃ ✧ 𝐀𝐥𝐢𝐚𝐬𝐞𝐬: ${aliases?.length ? aliases.join(", ") : "None"}\n` +
				`┃ ✧ 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${desc}\n` +
				`┃ ✧ 𝐔𝐬𝐚𝐠𝐞: ${usage}\n` +
				`━━━━━━━━━━━━━━━━━━━━━\n` +
				`┃ ✧ 𝐀𝐮𝐭𝐡𝐨𝐫: ${author}\n` +
				`┗━━━━━━━━━━━━━━━━━━━━┛`
			);
		}

		let msg = `🌸 ——— 『 𝗠𝗜𝗞𝗔𝗦𝗔 𝗕𝗢𝗧 』 ——— 🌸\n`;
		msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
		
		const sortedCategories = Object.keys(categories).sort();
		for (const cat of sortedCategories) {
			const capitalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
			msg += `\n┏━━━  ｢ ${capitalizedCat} ｣\n`; 
			msg += `┃ ${categories[cat].sort().map(item => `• ${item}`).join('\n┃ ')}\n`;
			msg += `┗━━━━━━━━━━━━━━━━━━◇\n`;
		}

		msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
		msg += `📝 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${allCommands.size}\n`;
		msg += `💡 𝐔𝐬𝐞: ${prefix}help [name] for info\n`;
		msg += `📬 𝐔𝐬𝐞: ${prefix}callad for support`;

		return message.reply(msg);
	}
};
