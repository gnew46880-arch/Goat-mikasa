const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sl",
    version: "1.3",
    author: "ᴀɴɪᴋ_🐢",
    role: 2,
    shortDescription: "Toggle selfListen instantly",
    longDescription: "Enable or disable bot's ability to listen to its own messages without restart",
    category: "owner",
    guide: "/sl on | /sl off"
  },

  onStart: async function ({ args, message, event, api }) {
    const allowedUIDs = ["61591976870960","61587772675514"]; // এখানে আরো UID দিতে পারো

    if (!allowedUIDs.includes(event.senderID)) {
      return message.reply("❌ Sorry bro, you don't have permission to run this.");
    }

    const input = args[0]?.toLowerCase();

    const configPath = path.join(__dirname, "..", "..", "config.json");
    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (err) {
      return message.reply("❌ Oops! Can't load config.json file.");
    }

    if (!input) {
      const status = config.optionsFca.selfListen ? "ON" : "OFF";
      return message.reply(`🤖 selfListen is currently *${status}*.\nUse: /sl on or /sl off`);
    }

    if (!["on", "off"].includes(input)) {
      return message.reply("❌ Use it like this: /sl on or /sl off");
    }

    const newValue = input === "on";

    const attitudeReplies = {
      on: [
        "SelfListen On ✅",
      ],
      off: [
        "SelfListen off ✅",
      ],
    };

    try {
      config.optionsFca.selfListen = newValue;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      api.setOptions({ selfListen: newValue });

      // Random attitude reply from the list
      const replies = attitudeReplies[input];
      const replyMsg = replies[Math.floor(Math.random() * replies.length)];

      message.reply(`✅ ${replyMsg} (No restart needed.)`);
      console.log(`[SL COMMAND] selfListen changed to ${newValue} by ${event.senderID} at ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error("[SL COMMAND ERROR]", err);
      message.reply("❌ Something went wrong while updating config.");
    }
  }
};
