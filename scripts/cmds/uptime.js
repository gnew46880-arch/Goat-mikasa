const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports = {
    config: {
        name: "up",
        aliases: ["uptime", "status", "upt", "dashboard"],
        version: "14.0.0",
        author: "Zihad Ahmed",
        countDown: 5,
        role: 0,
        description: "Dynamic Top 10 Hits with Extra Bot Info Dashboard.",
        category: "system"
    },

    onStart: async function ({ api, event, usersData }) {
        const { threadID, messageID } = event;
        
        try {
            // --- ১. তথ্য সংগ্রহ ---
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const mins = Math.floor((uptime % 3600) / 60);
            const uptimeString = `${days}d ${hours}h ${mins}m`;

            // Shob command er list theke top 10 ber kora (Dynamic)
            const allCommands = Array.from(global.GoatBot.commands.values());
            const sortedCommands = allCommands
                .filter(cmd => (cmd.countUsage || 0) > 0) // Shudhu use hoyeche emon gulo
                .sort((a, b) => (b.countUsage || 0) - (a.countUsage || 0))
                .slice(0, 10);

            const maxHit = sortedCommands.length > 0 ? sortedCommands[0].countUsage : 1;
            const totalUsers = global.db.allUserData.length;
            const totalThreads = global.db.allThreadData.length;
            const botAvatarURL = await usersData.getAvatarUrl(api.getCurrentUserID());

            // Extra Info
            const totalCommands = allCommands.length;
            const nodeVersion = process.version;
            const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

            // --- ২. ক্যানভাস সেটআপ ---
            const width = 1200;
            const height = 1000; // Ektu boro korlam extra info er jonno
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#05060a";
            ctx.fillRect(0, 0, width, height);

            // ৩. হেডার
            drawRoundedRect(ctx, 30, 30, 1140, 110, 25, "#0f111a");
            try {
                const avatar = await loadImage(botAvatarURL);
                ctx.save();
                ctx.beginPath();
                ctx.arc(90, 85, 45, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(avatar, 45, 40, 90, 90);
                ctx.restore();
            } catch (e) { console.log("Avatar failed"); }

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 40px sans-serif";
            ctx.fillText("OWNER BOT -  Dashboard", 160, 95);

            // ৪. বাম প্যানেল (Bot Information)
            drawRoundedRect(ctx, 30, 160, 360, 560, 30, "#0f111a");
            const infoItems = [
                { l: "VERSION", v: "14.0.0", c: "#2ea043", char: "V" },
                { l: "NODE.JS", v: nodeVersion, c: "#1f6feb", char: "N" },
                { l: "UPTIME", v: uptimeString, c: "#d29922", char: "U" },
                { l: "TOTAL CMDS", v: totalCommands.toString(), c: "#8957e5", char: "C" }
            ];

            infoItems.forEach((item, i) => {
                let y = 260 + (i * 125);
                ctx.fillStyle = item.c;
                ctx.beginPath();
                ctx.arc(85, y - 20, 35, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 30px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(item.char, 85, y - 10);
                ctx.textAlign = "left";
                ctx.fillStyle = "#9ca3af";
                ctx.font = "bold 18px sans-serif";
                ctx.fillText(item.l, 140, y - 35);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 26px sans-serif";
                ctx.fillText(item.v, 140, y + 5);
            });

            // ৫. কমান্ড গ্রিড (Top 10 Hits)
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 30px sans-serif";
            ctx.fillText("Top 10 Command Usage", 420, 200);

            const hitColors = ["#ff5733", "#33ff57", "#3357ff", "#f333ff", "#33fff3", "#fff333", "#ff8333", "#e91e63", "#00bcd4", "#ffeb3b"];

            sortedCommands.forEach((cmd, index) => {
                let col = index % 2;
                let row = Math.floor(index / 2);
                let x = 420 + (col * 375);
                let y = 230 + (row * 95);
                let hits = cmd.countUsage || 0;
                let barWidth = (hits / maxHit) * 310;
                let rColor = hitColors[Math.floor(Math.random() * hitColors.length)];

                drawRoundedRect(ctx, x, y, 360, 85, 15, "#161b22");
                ctx.fillStyle = "#ffa500"; 
                ctx.font = "bold 22px sans-serif";
                ctx.fillText(`${index + 1}. ${cmd.config.name.toUpperCase()}`, x + 25, y + 38);
                
                ctx.textAlign = "right";
                ctx.fillStyle = rColor;
                ctx.font = "bold 18px sans-serif";
                ctx.fillText(`${hits} hits`, x + 335, y + 38);
                ctx.textAlign = "left";

                // Orange Progress Bar
                drawRoundedRect(ctx, x + 25, y + 58, 310, 7, 4, "#21262d");
                drawRoundedRect(ctx, x + 25, y + 58, Math.max(barWidth, 5), 7, 4, "#ffa500");
            });

            // ৬. সিস্টেম মেমোরি পারফরম্যান্স (Orange/Dynamic Style)
            drawRoundedRect(ctx, 420, 730, 750, 130, 25, "#0f111a");
            const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
            const ramPercent = (ramUsage / totalMem) * 100;

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 25px sans-serif";
            ctx.fillText("Memory Performance", 450, 775);
            ctx.fillStyle = "#9ca3af";
            ctx.font = "18px sans-serif";
            ctx.fillText(`${ramUsage} MB / ${totalMem} MB Used`, 450, 805);

            drawRoundedRect(ctx, 450, 820, 680, 15, 8, "#1f2937");
            drawRoundedRect(ctx, 450, 820, (ramPercent * 6.8), 15, 8, "#ffa500");

            // ৭. বট স্ট্যাটিস্টিক্স (Users & Groups)
            drawRoundedRect(ctx, 30, 740, 360, 210, 30, "#0f111a");
            
            // Users
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 35px sans-serif";
            ctx.fillText(totalUsers.toLocaleString(), 65, 805);
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#9ca3af";
            ctx.fillText("GLOBAL USERS", 65, 830);
            
            // Groups
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 35px sans-serif";
            ctx.fillText(totalThreads.toLocaleString(), 65, 895);
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#9ca3af";
            ctx.fillText("ACTIVE GROUPS", 65, 920);

            // ৮. এক্সট্রা ইনফো বক্স (নিচে ডান পাশে)
            drawRoundedRect(ctx, 420, 880, 750, 70, 20, "#11141d");
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "18px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`OS: ${os.type()} ${os.arch()} | Platform: ${os.platform()} | CPU Cores: ${os.cpus().length}`, 795, 922);

            // ৯. ফুটার
            ctx.fillStyle = "#4b5563";
            ctx.font = "14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("© 2026 Owner Bot - Premium System Dashboard", width / 2, height - 15);

            const pathImg = path.join(__dirname, "cache", `dynamic_top_${Date.now()}.png`);
            if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));
            fs.writeFileSync(pathImg, canvas.toBuffer());

            return api.sendMessage({
                attachment: fs.createReadStream(pathImg)
            }, threadID, () => fs.unlinkSync(pathImg), messageID);

        } catch (err) {
            console.error(err);
            return api.sendMessage("Dashboard generating failed!", threadID);
        }
    }
};

function drawRoundedRect(ctx, x, y, w, h, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
            }
