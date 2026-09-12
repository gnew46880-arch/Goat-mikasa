const { Canvas, loadImage } = require("canvas");
const { resolve } = require("path");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
	config: {
		name: "top",
		aliases: ['baltop', 'balnacetop', 'banktop'],
		version: "2.8",
		author: "Zihad Ahmed",
		countDown: 10,
		role: 0,
		description: {
			en: "View the balance leaderboard (Top 3 specially styled + List of 12)."
		},
		category: "economy",
		guide: {
			en: "   {pn}: Show top 15 balance leaderboard."
		}
	},

	envConfig: {
		"ACCESS_TOKEN": "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
	},

	onStart: async function ({ message, event, usersData }) {
		const { threadID } = event;

		const numFormatter = (num) => {
			const units = ["", "K", "M", "B", "T"];
			let i = 0;
			while (num >= 1000 && i < units.length - 1) {
				num /= 1000;
				i++;
			}
			return num.toFixed(1).replace(/\.0$/, "") + units[i];
		};

		// র‍্যান্ডম থিম সিলেকশন
		const themes = [
			{ primary: '#FF4500', bg: ['#090401', '#17110D'] }, 
			{ primary: '#00FFFF', bg: ['#010409', '#0D1117'] }, 
			{ primary: '#F8F32B', bg: ['#040109', '#170D11'] }, 
			{ primary: '#FF00FF', bg: ['#090109', '#110D17'] }, 
			{ primary: '#00FF00', bg: ['#010901', '#0D170D'] }
		];
		const theme = themes[Math.floor(Math.random() * themes.length)];

		const allUsers = await usersData.getAll();
		let combinedData = allUsers.map(u => ({
			uid: u.userID,
			name: u.name || "Facebook User",
			balance: u.money || 0
		})).sort((a, b) => b.balance - a.balance);

		const top15 = combinedData.slice(0, 15);
		const canvas = new Canvas(1200, 1900);
		const ctx = canvas.getContext('2d');
		
		const bgGradient = ctx.createLinearGradient(0, 0, 0, 1900);
		bgGradient.addColorStop(0, theme.bg[0]);
		bgGradient.addColorStop(1, theme.bg[1]);
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0, 0, 1200, 1900);

		// Title
		ctx.textAlign = 'center';
		ctx.font = 'bold 80px sans-serif';
		ctx.fillStyle = theme.primary;
		ctx.fillText("LEADERBOARD", 600, 100);

		// Top 3 Positions (🥇 1st, 🥈 2nd, 🥉 3rd)
		const podPositions = [
			{ x: 600, y: 300, r: 100, color: '#FFD700', rank: 1 }, // 1st
			{ x: 950, y: 350, r: 85, color: '#C0C0C0', rank: 2 },  // 2nd
			{ x: 250, y: 350, r: 85, color: '#CD7F32', rank: 3 }   // 3rd
		];

		for (let i = 0; i < 3; i++) {
			const user = top15[i];
			if (!user) continue;
			const pos = podPositions[i];

			// Avatar Circle
			try {
				const avtUrl = `https://graph.facebook.com/${user.uid}/picture?width=512&height=512&access_token=${this.envConfig.ACCESS_TOKEN}`;
				const avtRes = await axios.get(avtUrl, { responseType: 'arraybuffer' });
				const avtImg = await loadImage(Buffer.from(avtRes.data, 'binary'));
				
				ctx.save();
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
				ctx.lineWidth = 10;
				ctx.strokeStyle = pos.color;
				ctx.stroke();
				ctx.clip();
				ctx.drawImage(avtImg, pos.x - pos.r, pos.y - pos.r, pos.r * 2, pos.r * 2);
				ctx.restore();
			} catch (e) {
				ctx.fillStyle = pos.color;
				ctx.beginPath(); ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2); ctx.fill();
			}

			// Rank & Name for Top 3
			ctx.textAlign = 'center';
			ctx.fillStyle = pos.color;
			ctx.font = 'bold 40px sans-serif';
			ctx.fillText(`#${pos.rank}`, pos.x, pos.y - pos.r - 20);
			
			ctx.fillStyle = '#FFFFFF';
			ctx.font = 'bold 30px sans-serif';
			ctx.fillText(user.name.split(' ')[0], pos.x, pos.y + pos.r + 40);
			
			ctx.fillStyle = theme.primary;
			ctx.font = 'bold 35px sans-serif';
			ctx.fillText(numFormatter(user.balance), pos.x, pos.y + pos.r + 85);
		}

		// List (4 to 15)
		let currentY = 580;
		const listUsers = top15.slice(3);
		
		for (let i = 0; i < listUsers.length; i++) {
			const user = listUsers[i];
			const rank = i + 4;

			ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
			ctx.beginPath();
			ctx.roundRect(50, currentY - 45, 1100, 90, 15);
			ctx.fill();

			ctx.textAlign = 'left';
			ctx.font = 'bold 40px sans-serif';
			ctx.fillStyle = '#8B949E';
			ctx.fillText(`#${rank}`, 80, currentY + 12);

			ctx.fillStyle = '#FFFFFF';
			ctx.fillText(user.name.substring(0, 20), 220, currentY + 12);

			ctx.textAlign = 'right';
			ctx.fillStyle = theme.primary;
			ctx.fillText(`${numFormatter(user.balance)} $`, 1120, currentY + 12);

			currentY += 105;
		}

		const cachePath = resolve(__dirname, 'cache', `top15_styled_${threadID}.png`);
		const out = fs.createWriteStream(cachePath);
		const stream = canvas.createPNGStream();
		stream.pipe(out);

		out.on('finish', () => {
			message.reply({
				attachment: fs.createReadStream(cachePath)
			}, () => {
				if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
			});
		});
	}
};
