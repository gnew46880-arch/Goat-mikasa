const axios = require('axios');

module.exports = {
	config: {
		name: 'npm',
		version: '1.0',
		author: 'RANA',  //Don't change the credit because I made it. Any problems to contact me. https://facebook.com/100063487970328
		countDown: 5,
		role: 0,
		shortDescription: 'Get info on Npm package',
		longDescription: {
			en: 'Get detailed info on an Npm package',
		},
		category: 'info',
		guide: {
			en: '{p}npm package-name',
		},
	},

	onStart: async function ({ api, event, args }) {
		if (!args.length) {
			return api.sendMessage('𝙿𝚕𝚎𝚊𝚜𝚎 𝙿𝚛𝚘𝚟𝚒𝚍𝚎 𝙰𝚗 𝙽𝚙𝚖 𝙿𝚊𝚌𝚔𝚊𝚐𝚎 𝙽𝚊𝚖𝚎.. \n 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 : /npm rana-videos-downloader', event.threadID);
		}

		const packageName = encodeURIComponent(args.join(' '));

		try {
			const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
			const npmInfo = response.data;

			const latestVersion = npmInfo['dist-tags'].latest;
			const packageDetails = npmInfo.versions[latestVersion];

			const message = `
📦| 𝗣𝗮𝗰𝗸𝗮𝗴𝗲: ${npmInfo.name}
🔹| 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${latestVersion}
📜| 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${npmInfo.description || 'No description available'}
👤| 𝗔𝘂𝘁𝗵𝗲𝗿: ${packageDetails.author?.name || 'Unknown'}
📅| 𝗣𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱: ${new Date(packageDetails.time?.created).toLocaleString()}
📥| 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝘀: https://npm-stat.com/charts.html?package=${npmInfo.name}
🔗| 𝗣𝗮𝗴𝗲: https://www.npmjs.com/package/${npmInfo.name}
📂| 𝗥𝗲𝗽𝗼: ${packageDetails.repository?.url || 'Not available'}
📑| 𝗟𝗶𝗰𝗲𝗻𝘀𝗲: ${packageDetails.license || 'Unknown'}
`;

			api.sendMessage(message, event.threadID);
		} catch (error) {
			console.error('Error fetching NPM package info:', error);
			api.sendMessage('Error fetching NPM package info. Make sure the package name is correct and try again.', event.threadID);
		}
	},
};
