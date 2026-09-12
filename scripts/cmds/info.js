const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info",
    aliases: ["owner", "admins"],
    version: "90.0.0",
    author: "Zihad",
    countDown: 5,
    role: 0,
    shortDescription: "Admin Information",
    category: "info"
  },

  onStart: async function ({ api, event, message }) {
    const W = 1200, H = 1650; 
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    // ১. থ্রিডি স্পেস ব্যাকগ্রাউন্ড ও ঝিলমিল তারা
    const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W);
    bgGrad.addColorStop(0, "#0d0d2b");
    bgGrad.addColorStop(1, "#020205");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    function drawStars(count, xLimit, yLimit, xOffset = 0, yOffset = 0) {
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.fillStyle = i % 10 === 0 ? "#00ffff" : "#ffffff";
        ctx.shadowBlur = Math.random() * 15;
        ctx.shadowColor = "#ffffff";
        ctx.arc(xOffset + Math.random() * xLimit, yOffset + Math.random() * yLimit, Math.random() * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    drawStars(400, W, H);

    // ২. বড় ও উজ্জ্বল ৩ডি আইকন
    drawNotificationBell(ctx, 75, 65, "#ffffff");
    drawDarkMoon(ctx, W - 125, 65, "#ffcc00");

    // ৩. ৩ডি গ্লোয়িং বট প্রোফাইল
    const botPicUrl = "https://i.ibb.co.com/fzMYFqHq/1781263236767.jpg";
    ctx.save();
    ctx.shadowBlur = 120; ctx.shadowColor = "#bc13fe";
    ctx.beginPath(); ctx.arc(W/2, 230, 165, 0, Math.PI * 2);
    ctx.strokeStyle = "#bc13fe"; ctx.lineWidth = 20; ctx.stroke(); ctx.clip();
    try {
      const img = await loadImage(botPicUrl);
      ctx.drawImage(img, (W/2) - 165, 65, 330, 330);
    } catch (e) { ctx.fillStyle = "#333"; ctx.fill(); }
    ctx.restore();

    ctx.textAlign = "center";
    ctx.font = "900 85px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 25; ctx.shadowColor = "#00ffff";
    ctx.fillText("MIKASA BOT INFO", W/2, 475);
    ctx.shadowBlur = 0;

    // ৪. ৩ডি সিস্টেম বক্স (UPTIME & SERVER)
    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);

    // সিস্টেম বক্স ৩ডি স্টাইল
    draw3DBox(ctx, 150, 510, 900, 100, 35, "#bc13fe");
    drawStars(40, 900, 100, 150, 510);
    ctx.font = "900 35px sans-serif"; ctx.fillStyle = "#ffffff";
    ctx.fillText(`SYSTEM UPTIME: ${days}D ${hours}H ${mins}M | VERSION: 9.0`, W/2, 575);

    // সার্ভার বক্স ৩ডি স্টাইল
    draw3DBox(ctx, 150, 635, 900, 100, 35, "#00ffff");
    drawStars(40, 900, 100, 150, 635);
    ctx.font = "bold 32px sans-serif"; ctx.fillStyle = "#00ffff";
    ctx.fillText(`SERVER: ONLINE | PING: 10MS | PREFIX: >`, W/2, 700);

    // ৫. ৩ডি এডমিন কার্ড (Side-by-Side)
    const admins = [
      { 
        name: "Zihad Ahmed", role: "Owner", home: "Tangail, BD", age: "18+", 
        rls: "Single", religion: "Islam", region: "South Asia", blood: "O+",
        occ: "Student & Dev", lang: "JS & Python", status: "Gamer & Dev", 
        uid: "61591976870960", color: "#39ff14", x: 60 
      },
      { 
        name: "Or'ko", role: "Admin", home: "Tangail, BD", age: "21+", 
        rls: "Single", religion: "Islam", region: "South Asia", blood: "B+",
        occ: "Noob Developer", lang: "NodeJS & C++", status: "Coding is Life", 
        uid: "61590070405902", color: "#00ffff", x: 630 
      }
    ];

    for (let admin of admins) {
        const y = 800;
        draw3DBox(ctx, admin.x, y, 510, 780, 60, admin.color);
        drawStars(60, 510, 780, admin.x, y);

        const avatarUrl = `https://graph.facebook.com/${admin.uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        ctx.save();
        ctx.beginPath(); ctx.arc(admin.x + 255, y + 130, 120, 0, Math.PI * 2);
        ctx.clip();
        try {
          const img = await loadImage(avatarUrl);
          ctx.drawImage(img, admin.x + 135, y + 10, 240, 240);
        } catch (e) { ctx.fillStyle = "#222"; ctx.fill(); }
        ctx.restore();

        // অনলাইন ডট
        ctx.beginPath(); ctx.arc(admin.x + 355, y + 215, 24, 0, Math.PI * 2);
        ctx.fillStyle = "#39ff14"; ctx.fill();
        ctx.strokeStyle = "#0d0d12"; ctx.lineWidth = 6; ctx.stroke();

        ctx.textAlign = "center"; ctx.font = "900 50px sans-serif"; ctx.fillStyle = "#ffffff";
        ctx.fillText(admin.name, admin.x + 255, y + 315);
        const nameWidth = ctx.measureText(admin.name).width;
        drawVerifyBadge(ctx, admin.x + 255 + (nameWidth/2) + 30, y + 295);

        ctx.font = "bold 32px sans-serif"; ctx.fillStyle = admin.color;
        ctx.fillText(admin.role.toUpperCase(), admin.x + 255, y + 375);

        ctx.font = "900 25px sans-serif"; ctx.fillStyle = "#ffffff"; ctx.textAlign = "left";
        let startX = admin.x + 45;
        ctx.fillText(`HOME      : ${admin.home}`, startX, y + 450);
        ctx.fillText(`AGE       : ${admin.age}`, startX, y + 495);
        ctx.fillText(`RELIGION  : ${admin.religion}`, startX, y + 540);
        ctx.fillText(`REGION    : ${admin.region}`, startX, y + 585);
        ctx.fillText(`BLOOD     : ${admin.blood}`, startX, y + 630);
        ctx.fillText(`OCCUPATION: ${admin.occ}`, startX, y + 675);
        ctx.fillText(`LANG      : ${admin.lang}`, startX, y + 720);
        ctx.fillText(`STATUS    : ${admin.rls}`, startX, y + 765);

        ctx.font = "italic bold 23px sans-serif"; ctx.fillStyle = "#bbbbbb"; ctx.textAlign = "center";
        ctx.fillText(`"${admin.status}"`, admin.x + 255, y + 815);
    }

    ctx.textAlign = "center"; ctx.font = "bold 22px sans-serif"; ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(`${moment.tz("Asia/Dhaka").format("DD/MM/YYYY | hh:mm A")}`, W/2, H - 40);

    const cachePath = path.join(__dirname, "cache", `mikasa_3d_dash_${event.senderID}.png`);
    fs.ensureDirSync(path.join(__dirname, "cache"));
    fs.writeFileSync(cachePath, canvas.toBuffer());
    return message.reply({ attachment: fs.createReadStream(cachePath) }, () => fs.unlinkSync(cachePath));
  }
};

// ৩ডি বক্স ফাংশন
function draw3DBox(ctx, x, y, w, h, r, color) {
  ctx.save();
  // শ্যাডো লেয়ার
  ctx.shadowBlur = 45; ctx.shadowColor = color + "66";
  ctx.fillStyle = "#0d0d12";
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  
  // আউটার বর্ডার
  ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.stroke();
  
  // ইনার গ্লো বা বেজেল (3D লুকের জন্য)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x + 5, y + 5, w - 10, h - 10, r - 5); ctx.stroke();
  ctx.restore();
}

function drawNotificationBell(ctx, x, y, color) {
  ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.fillStyle = color;
  ctx.shadowBlur = 25; ctx.shadowColor = "#ffffff";
  ctx.moveTo(15, 0); ctx.lineTo(15, 10); ctx.arc(15, 35, 18, -Math.PI/2, Math.PI/2, true);
  ctx.lineTo(35, 40); ctx.lineTo(0, 40); ctx.lineTo(15, 35); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(15, 45, 8, 0, Math.PI, false); ctx.fill();
  ctx.beginPath(); ctx.arc(35, 10, 12, 0, Math.PI * 2); ctx.fillStyle = "#ff0000"; ctx.fill();
  ctx.strokeStyle = "#000000"; ctx.lineWidth = 3.5; ctx.stroke(); ctx.restore();
}

function drawDarkMoon(ctx, x, y, color) {
  ctx.save(); ctx.translate(x, y); ctx.beginPath();
  ctx.arc(0, 0, 40, -Math.PI/2, Math.PI/2, false);
  ctx.arc(18, 0, 32, Math.PI/2, -Math.PI/2, true);
  ctx.closePath(); ctx.fillStyle = color;
  ctx.shadowBlur = 35; ctx.shadowColor = color;
  ctx.fill(); ctx.restore();
}

function drawVerifyBadge(ctx, x, y) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#0078ff"; ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x - 2, y + 7); ctx.lineTo(x + 9, y - 7);
    ctx.stroke(); ctx.restore();
}
