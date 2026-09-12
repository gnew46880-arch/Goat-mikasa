const axios = require("axios");

module.exports = {
  config: {
    name: "otp",
    version: "5.0",
    author: "Zihad Ahmed",
    countDown: 5,
    role: 0,
    shortDescription: "OTP List with Reply Detail",
    longDescription: "Show list and reply with number to see full details",
    category: "utility"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const res = await axios.get("http://147.135.212.197/crapi/st/viewstats", {
        params: {
          token: "RFdUREJBUzR9T4dVc49ndmFra1NYV5CIhpGVcnaOYmqHhJZXfYGJSQ==",
          records: "10"
        }
      });

      let data = Array.isArray(res.data) ? res.data : [];
      if (!data.length) return message.reply("❌ No OTP Found");

      let text = "📩 OTP LIST (Latest 10)\n\n";
      data.forEach((e, i) => {
        let phone = e[1];
        let masked = phone.length > 6 ? phone.slice(0, 5) + "**" + phone.slice(-3) : phone;
        text += `🔹 ${i + 1} | ${e[0]}\n📞 ${masked}\n⏰ ${e[3]}\n\n`;
      });

      text += "💡 Reply with the serial number (1-10) to see full details.";

      message.reply(text, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          data: data
        });
      });

    } catch (err) {
      message.reply("❌ API Error");
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { data, messageID, author } = Reply;
    if (event.senderID != author) return;

    const input = event.body.trim();
    const index = parseInt(input) - 1;

    if (isNaN(input) || index < 0 || index >= data.length) {
      return message.reply("❌ Invalid serial number. Please choose 1-10.");
    }

    // আগের মেসেজটি রিমুভ (Unsend) করা
    api.unsendMessage(messageID);

    const e = data[index];
    const app = e[0];
    const phone = e[1]; // Full Number
    const msg = e[2];
    const time = e[3];

    // OTP detection logic
    const detectOTP = (m) => {
      m = m.replace(/\n/g, " ");
      let match = m.match(/\b\d{3}[- ]?\d{3,5}\b/) || m.match(/\b\d{4,8}\b/);
      return match ? match[0].replace(/[- ]/g, "") : "N/A";
    };

    let details = `✅ 𝐒𝐄𝐋𝐄𝐂𝐓𝐄𝐃 𝐎𝐓𝐏 𝐃𝐄𝐓𝐀𝐈𝐋𝐒\n` +
                  `━━━━━━━━━━━━━━━━━━\n` +
                  `📱 𝐀𝐩𝐩: ${app}\n` +
                  `📞 𝐍𝐮𝐦𝐛𝐞𝐫: ${phone}\n` +
                  `🔑 𝐎𝐓𝐏: ${detectOTP(msg)}\n` +
                  `⏰ 𝐓𝐢𝐦𝐞: ${time}\n` +
                  `📝 𝐌𝐬𝐠: ${msg.replace(/\n/g, " ")}`;

    message.reply(details);
  }
};
