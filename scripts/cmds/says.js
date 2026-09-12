const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "say",
    aliases: ["voice"],
    author: "Daraz",
    version: "2.6",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "Japanese TTS with dynamic speaker & reply" },
    category: "𝗔𝗜",
    guide: { en: "{pn} [speaker_id] [text] or {pn} [text]" }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const { createReadStream, unlinkSync } = fs;
      const { resolve } = path;
      const { messageID, threadID, senderID } = event;

      if (!args[0]) {
        const greets = ["𝐊𝐨𝐧𝐢𝐜𝐡𝐢𝐰𝐚", "𝐊𝐨𝐧𝐢𝐜𝐡𝐢𝐰𝐚 𝐒𝐞𝐧𝐩𝐚𝐢", "𝐇𝐨𝐫𝐚!"];
        const ranGreet = greets[Math.floor(Math.random() * greets.length)];
        return api.sendMessage(ranGreet, threadID, messageID);
      }

      let speaker = 2; // Default speaker id
      let chat;

      // চেক করছি প্রথম আর্গুমেন্ট কি কোনো নাম্বার কি না
      if (!isNaN(args[0]) && args.length > 1) {
        speaker = args[0];
        chat = args.slice(1).join(" ");
      } else {
        chat = args.join(" ");
      }

      if (!chat) return api.sendMessage("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐬𝐨𝐦𝐞 𝐭𝐞𝐱𝐭.", threadID, messageID);

      const processing = await api.sendMessage("⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭, 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐯𝐨𝐢𝐜𝐞...", threadID, messageID);
      const audioPath = resolve(__dirname, 'cache', `${threadID}_${senderID}.mp3`);
      const text = encodeURIComponent(chat);

      // API Call with dynamic speaker
      const audioApi = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${text}&speaker=${speaker}`);
      const audioUrl = audioApi.data.mp3StreamingUrl;

      if (!audioUrl) {
        return api.editMessage("❌ 𝐒𝐩𝐞𝐚𝐤𝐞𝐫 𝐈𝐃 𝐢𝐬 𝐢𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐫 𝐀𝐏𝐈 𝐢𝐬 𝐝𝐨𝐰𝐧.", processing.messageID);
      }

      await global.utils.downloadFile(audioUrl, audioPath);
      const att = createReadStream(audioPath);

      await api.unsendMessage(processing.messageID);
      
      // এখানে messageID দিয়ে রিপ্লাই কনফার্ম করা হয়েছে
      api.sendMessage({
        body: `🗣️ 𝐒𝐩𝐞𝐚𝐤𝐞𝐫 𝐈𝐃: ${speaker}\n📝 𝐓𝐞𝐱𝐭: ${chat}`,
        attachment: att
      }, threadID, () => {
        if (fs.existsSync(audioPath)) unlinkSync(audioPath);
      }, messageID); // এই messageID টাই হলো রিপ্লাই ট্রিক

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐯𝐨𝐢𝐜𝐞.", event.threadID, event.messageID);
    }
  }
};
