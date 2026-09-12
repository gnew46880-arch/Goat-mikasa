const axios = require("axios");

module.exports = {
  config: {
    name: "magi",
    version: "1.4",
    author: "Zihad Ahmed",
    countDown: 3,
    role: 0,
    shortDescription: "Chat with Magi AI",
    longDescription: "Converse with Magi AI, powered by Vercel API.",
    category: "AI",
    guide: "{p}magi <text>"
  },

  // Random response call messages
  randomCallMessages: [
    "Ki bolbi bol behencud? 🤬",
    "Arey daklis ken, ki bal lagbe? 💀",
    "Haan bolo, ki somossha magir pola? 🖕",
    "Magi hajir! Ki roast khabi bol? 🔥",
    "Dak shunlam, taratari bol ki lagbe! 🔪"
  ],

  getRandomCallMessage: function () {
    const messages = this.randomCallMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  },

  getMagiReply: async function (api, event, query, commandName = "magi") {
    const uid = event.senderID.toString();
    const apiUrl = "https://or-ko.vercel.app/api/chat";

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.post(apiUrl, {
        uid: uid,
        message: query,
        model: "gemini-3.1-flash-lite"
      });

      const data = response.data;

      if (data.status !== "success" || !data.reply) {
        return api.sendMessage(
          "❌ Server e jhamela hoise behencud!",
          event.threadID,
          event.messageID
        );
      }

      const finalResponse = data.reply;

      api.sendMessage(
        finalResponse,
        event.threadID,
        (err, msgInfo) => {
          if (!err) {
            const reactions = ["🤬", "🖕", "💀", "🔥", "🔪"];
            const randomReact = reactions[Math.floor(Math.random() * reactions.length)];
            api.setMessageReaction(randomReact, event.messageID, () => {}, true);

            global.GoatBot.onReply.set(msgInfo.messageID, {
              commandName: commandName,
              type: "reply",
              messageID: msgInfo.messageID,
              author: event.senderID,
              text: finalResponse
            });
          }
        },
        event.messageID
      );

    } catch (error) {
      console.error("Magi API Error:", error);
      api.sendMessage(
        "❌ Connection e jhamela hoise behencud! Abar try mar.",
        event.threadID,
        event.messageID
      );
    }
  },

  onStart: async function ({ api, event, args }) {
    let query = args.join(" ").trim();

    if (event.type === "message_reply" && event.messageReply) {
      query = event.messageReply.body?.trim() || "";
    }

    if (!query) {
      const randomMessage = this.getRandomCallMessage();
      return api.sendMessage(
        randomMessage,
        event.threadID,
        (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "magi",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: randomMessage
            });
          }
        },
        event.messageID
      );
    }

    await this.getMagiReply(api, event, query);
  },

  onChat: async function ({ api, event }) {
    try {
      const body = event.body?.trim() || "";
      if (!body) return;
      if (!/^magi(?:\s|$)/i.test(body)) return;

      const query = body.replace(/^magi\s*/i, "").trim();

      if (!query) {
        const randomMessage = this.getRandomCallMessage();
        return api.sendMessage(
          randomMessage,
          event.threadID,
          (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "magi",
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                text: randomMessage
              });
            }
          },
          event.messageID
        );
      }

      await this.getMagiReply(api, event, query);
    } catch (error) {
      console.error("Magi onChat Error:", error);
    }
  },

  onReply: async function ({ api, event }) {
    if (event.type !== "message_reply") return;
    
    const replyTarget = global.GoatBot.onReply.get(event.messageReply.messageID);
    if (!replyTarget || replyTarget.commandName !== "magi") return;

    const query = event.body?.trim();
    if (!query) return;

    await this.getMagiReply(api, event, query);
  }
};
