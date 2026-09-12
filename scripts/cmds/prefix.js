const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.5",
    author: "Edit By Zihad",
    countDown: 5,
    role: 0,
    description: "Change bot's prefix locally or globally (admin only)",
    category: "config",
    guide: {
      en: "   {pn} <new prefix>\n   {pn} <new prefix> -g\n   {pn} reset"
    }
  },

  langs: {
    en: {
      reset: "🔁 Your prefix has been reset to default: %1",
      onlyAdmin: "❌ Only bot admin can change system prefix!",
      confirmGlobal: "⚠ React to confirm system prefix change!",
      confirmThisThread: "⚠ React to confirm chat prefix change!",
      successGlobal: "✅ System prefix changed to: %1",
      successThisThread: "✅ Chat prefix changed to: %1",
      myPrefix:
        "╭━━ [ 𓆩𝆠꯭፝֟𝐌𝐈𝐊𝐀𝐒𝐀𝆠꯭፝֟𓆪࣪ ━━╮\n" +
        "┃🔰 𝐇ᴇʏ {userName}  😗\n" +
        "┃🔰 𝐒ʏsᴛᴇᴍ 𝐏ʀᴇғɪx: ❏ [  %1  ]\n" +
        "┃🔰 𝐂ʜᴀᴛ 𝐏ʀᴇғɪx: ❏ [  %2  ]\n" +
        "┃🔰 𝐌ʏ 𝐍ᴀᴍᴇ: 🎀 𝐌𝐈𝐊𝐀𝐒𝐀\n" +
        "╰━━━━━━━━━━━━━━╯"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g") {
      if (role < 2) return message.reply(getLang("onlyAdmin"));
      formSet.setGlobal = true;
    } else {
      formSet.setGlobal = false;
    }

    return message.reply(
      args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
      (err, info) => {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction = global.GoatBot.onReaction || new Map();
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang, usersData, api }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      // মেসেজ পাঠানোর আগে টাইপিং ইন্ডিকেটর দেখাবে
      api.sendTypingIndicator(true, event.threadID);

      const userName = await usersData.getName(event.senderID) || "User";

      const prefixMsg = getLang("myPrefix",
        global.GoatBot.config.prefix,
        await utils.getPrefix(event.threadID)
      ).replace("{userName}", userName);

      return message.reply(prefixMsg);
    }
  }
};
