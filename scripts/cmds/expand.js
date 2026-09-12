const axios = require("axios");

module.exports = {
  config: {
    name: "expand",
    version: "6.0",
    author: "Zihad Ahmed",
    role: 0,
    category: "AI",
    guide: {
      en: "{pn} reply image OR {pn} <url> - <size>\nExample: expand - 5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      let imageUrl = event?.messageReply?.attachments?.[0]?.url || null;
      let size = "3"; // default size

      // 👉 যদি args থেকে URL আসে
      if (!imageUrl && args.length > 0) {
        const match = args.join(" ").match(/https?:\/\/\S+/);
        if (match) imageUrl = match[0];
      }

      // 👉 size detect
      if (args.includes("-")) {
        const i = args.indexOf("-");
        if (args[i + 1]) size = args[i + 1];
      }

      // ❌ image না থাকলে
      if (!imageUrl) {
        return api.sendMessage(
          "⚠️ Reply to an image or give image URL",
          event.threadID,
          event.messageID
        );
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      // 🔥 Expand API
      const apiUrl = `https://www.noobs-apis.run.place/nazrul/expand?imgUrl=${encodeURIComponent(imageUrl)}&size=${size}`;

      const res = await axios.get(apiUrl, {
        responseType: "stream"
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return api.sendMessage(
        {
          body: `🖼️ Expanded Image (size: ${size})`,
          attachment: res.data
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.log(err.message);
      return api.sendMessage(
        "❌ Expand failed (API error or invalid image)",
        event.threadID,
        event.messageID
      );
    }
  }
};
