const axios = require("axios");
const { getTime, getStreamFromURL } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "7.5",
    author: "♡—͟͞͞ᴛꫝ֟፝ؖ۬ᴍɪᴍ ⸙",
    category: "events"
  },

  langs: {
    en: {
      session1: "✨ Good Morning",
      session2: "☀️ Good Noon",
      session3: "🌤️ Good Afternoon",
      session4: "🌆 Good Evening",
      session5: "🌙 Good Night"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const prefix = global.utils.getPrefix(threadID);
    const addedParticipants = event.logMessageData.addedParticipants || [];
    const { nickNameBot } = global.GoatBot.config;

    // Auto-enable welcome settings
    await threadsData.set(threadID, { "settings.sendWelcomeMessage": true });

    const hours = parseInt(getTime("HH"));
    const session =
      hours <= 10 ? getLang("session1") :
      hours <= 12 ? getLang("session2") :
      hours <= 18 ? getLang("session3") :
      hours <= 20 ? getLang("session4") :
      getLang("session5");

    // ================= 🤖 BOT JOIN LOGIC =================
    if (addedParticipants.some(u => u.userFbId == api.getCurrentUserID())) {
      if (nickNameBot) {
        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID()).catch(() => {});
      }

      const threadInfo = await api.getThreadInfo(threadID);
      const botJoinMedia = await getStreamFromURL("https://i.imgur.com/7wZoMNu.gif").catch(() => null);

      return message.send({
        body:
          `╭━━━〔 ❃ 𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 ❃ 〕━━━🌀\n` +
          `┃ 🩶 𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦\n` +
          `┃ 🕒 𝐒𝐞𝐬𝐬𝐢𝐨𝐧: ${session}\n` +
          `┃ 🏰 𝐆𝐫𝐨𝐮𝐩: ${threadInfo.threadName}\n` +
          `┃ 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${threadInfo.participantIDs.length}\n` +
          `┃ ⚙️ 𝐏𝐫𝐞𝐟𝐢𝐱: [ ${prefix} ]\n` +
          `┃ 📜 𝐇𝐞𝐥𝐩: Type ${prefix}help\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━━🌺\n\n` +
          `✨ ᴛʜᴀɴᴋꜱ ꜰᴏʀ ᴀᴅᴅɪɴɢ ᴍᴇ ᴛᴏ ʏᴏᴜʀ ᴄᴏᴍᴍᴜɴɪᴛʏ! ❤️`,
        attachment: botJoinMedia ? [botJoinMedia] : []
      });
    }

    // ================= 👥 MEMBER JOIN LOGIC =================
    if (!global.temp.welcomeEvent[threadID]) {
      global.temp.welcomeEvent[threadID] = { data: [], timeout: null };
    }

    global.temp.welcomeEvent[threadID].data.push(...addedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].timeout);

    global.temp.welcomeEvent[threadID].timeout = setTimeout(async () => {
      const threadData = await threadsData.get(threadID);
      const bannedUsers = threadData.data?.banned?.users || [];
      const threadInfo = await api.getThreadInfo(threadID);

      const names = [];
      const mentions = [];

      for (const u of global.temp.welcomeEvent[threadID].data) {
        if (bannedUsers.some(b => b.id == u.userFbId)) continue;
        names.push(u.fullName);
        mentions.push({ tag: u.fullName, id: u.userFbId });
      }

      if (!names.length) return;

      const adderID = event.author;
      const adderInfo = await api.getUserInfo(adderID).catch(() => ({}));
      const adderName = adderInfo[adderID]?.name || "a Guardian";

      const welcomeGif = await getStreamFromURL("https://i.imgur.com/fAAXnTN.gif").catch(() => null);

      await message.send({
        body:
          `╭━━━━━━〔 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━━━━━━\n` +
          `┃  💐 𝐇𝐞𝐥𝐥𝐨, ${names.join(", ")}!\n` +
          `┃  ✨ ${session}\n` +
          `┣━━━━━━━━━━━━━━━━━━━━━━━🌺\n` +
          `┃  📝 𝐍𝐚𝐦𝐞: ${names.join(" & ")}\n` +
          `┃  🏰 𝐆𝐫𝐨𝐮𝐩: ${threadInfo.threadName}\n` +
          `┃  📥 𝐀𝐝𝐝𝐞𝐝 𝐛𝐲: ${adderName}\n` +
          `┃  🔢 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐨𝐮𝐫 ${threadInfo.participantIDs.length}ᵗʰ 𝐌𝐞𝐦𝐛𝐞𝐫\n` +
          `┣━━━━━━━━━━━━━━━━━━━━━━━🌺\n` +
          `┃  🪐 ᴇɴᴊᴏʏ ʏᴏᴜʀ sᴛᴀʏ & sᴛᴀʏ ᴀᴄᴛɪᴠᴇ!\n` +
          `╰━━━━━━━〔 × ZIHAD × 〕━━━━━━━`,
        mentions: [...mentions, { tag: adderName, id: adderID }],
        attachment: welcomeGif ? [welcomeGif] : []
      });

      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
