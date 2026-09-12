module.exports = {
  config: {
    name: "antiout",
    version: "1.3",
    author: "Zihad Ahmed",
    countDown: 5,
    role: 0,
    shortDescription: "Enable or disable antiout",
    longDescription: "Automatically adds users back to the group if they leave.",
    category: "boxchat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },
  
  onStart: async function({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    
    const command = args[0] ? args[0].toLowerCase() : null;

    if (!["on", "off"].includes(command)) {
      const status = antiout ? "enabled (on)" : "disabled (off)";
      return message.reply(`Antiout currently set to: ${status}. Please use 'on' or 'off' as an argument.`);
    }
    
    const newState = command === "on";
    await threadsData.set(event.threadID, newState, "settings.antiout");
    
    return message.reply(`Antiout has been ${newState ? "enabled" : "disabled"}.`);
  },

  onEvent: async function({ api, event, threadsData }) {
    // Only run if it's a leave event
    if (event.logMessageType !== "log:unsubscribe") return;

    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      
      const userId = event.logMessageData.leftParticipantFbId;
      const authorId = event.author; // Who performed the action

      // 🛑 KICK PROTECTION: অন্য কেউ রিমুভ করলে বট এড দিবে না
      if (authorId != userId) {
        return; 
      }

      let userName = "User"; 
      
      try {
          const userInfo = await api.getUserInfo(userId);
          if (userInfo && userInfo[userId]) {
              userName = userInfo[userId].name;
          }
      } catch (e) {
          console.error("Failed to fetch user info:", e);
      }
      
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIsOut = threadInfo.participantIDs.indexOf(userId) === -1;

      if (userIsOut) {
        try {
          await api.addUserToGroup(userId, event.threadID);
          
          // ✅ NEW FUNNY MESSAGE (MAMA STYLE)
          api.sendMessage(
`${userName} না বলে গ্রুপ থেকে পালাতে চেয়েচিলো আবার ধরে আনলাম..!🗿`, 
            event.threadID
          );
          
        } catch (error) {
          // ❌ ERROR MESSAGE
          api.sendMessage(
            `${userName} মুগি চর লিফট নিলো..!😹`, 
            event.threadID
          );
        }
      }
    }
  }
};
