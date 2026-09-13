const axios = require("axios");

module.exports = {
  config: {
    name: "mikasa",
    version: "1.5",
    author: "Zihad Ahmed",
    countDown: 3,
    role: 0,
    shortDescription: "Chat with Mikasa AI",
    longDescription: "Converse with Mikasa AI, powered by Vercel.",
    category: "AI",
    guide: "Simply type 'mikasa <message>', 'mim <message>', 'rahi <message>', use command, or reply to Mikasa."
  },

  // Cute, playful, and slightly angry (ragi) Banglish random messages
  randomCallMessages: [
    "বার বার ডাকলে কিন্তু কামড় দিমু 😾!!",
    "আমাকে না দেখে একটু পড়তে বসতে পারো না 🥺🥺?",
    "কথা বলবো না যাও 😒... আগে একটা চকলেট দাও 🍫!",
    "বেশি মিস করছো নাকি 😏? এতো ডাকার কি আছে!",
    "হুম বলো 😒, বেশি ডিস্টার্ব করলে কিন্তু লিভ নিবো 😾",
    "অ্যাই! তোমার কোনো কাজ কাম নাই 😾? খালি আমাকে ডাকো কেন!",
    "বলো কি বলবা, সবার সামনে বলবা নাকি 🤭🤏?",
    "শুনবো না 😼 তুমি আমাকে পটাও নাই 🥺 পচা তুমি!!",
    "আজকে আমার মুড ভালো নাই 🙉 বেশি রাগাইও না তো!",
    "বেশি মিষ্টি মিষ্টি কথা বললে সোজা পিটামু কিন্তু 😼!!",
    "উফফ! আবার ডাকছো 😑? ঘুমাইতেও দিবা না আমাকে 🥺?",
    "হুম স্যার/ম্যাডাম 😌, আমার সাথে ঝগড়া করতে আসছেন নাকি?",
    "আমি অন্যের সাথে কথা বলি না 😒... তুমি কি আমার প্রিয় মানুষ 🥺?",
    "এমনে ডাকলে কিন্তু কিস করে দিমু 🙈... তখন বুঝবা!",
    "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒!",
    "তোর বিয়ে হয় নাই, বেবি বেবি করিস কেন 🙄😾?",
    "আমি কি তোমার কথা শোনার জন্য বসে আছি 🙄? বলো তাড়াতাড়ি!",
    "বেশি ডাকলে আম্মুকে বলে দিমু 🥺...",
    "হেই সিঙ্গেল লোক! এতো ডাকার কারণ কি 🫵🤨?",
    "আম গাছে আম নাই ঢিল কেন মারো 😒? প্রেম করার ইচ্ছা নাই বেবি কেন ডাকো 🫣!"
  ],

  getRandomCallMessage: function () {
    const messages = this.randomCallMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  },

  getOrkoReply: async function (api, event, query, commandName = "mikasa") {
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
          "❌ উহহ, সার্ভার একটু ঝামেলা করতেছে! আবার চেষ্টা করো তো 🥺",
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
            api.setMessageReaction("✅", event.messageID, () => {}, true);

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
      console.error("Mikasa API Error:", error);
      api.sendMessage(
        "❌ কানেকশনে ঝামেলা হইছে! পরে ট্রাই করো 😾",
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
              commandName: "mikasa",
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

    await this.getOrkoReply(api, event, query);
  },

  onChat: async function ({ api, event }) {
    try {
      const body = event.body?.trim() || "";
      if (!body) return;

      // Check if message starts with 'mikasa', 'mim', or 'rahi'
      const triggerRegex = /^(mikasa|mim|rahi)(?:\s|$)/i;
      if (!triggerRegex.test(body)) return;

      const query = body.replace(triggerRegex, "").trim();

      if (!query) {
        const randomMessage = this.getRandomCallMessage();
        return api.sendMessage(
          randomMessage,
          event.threadID,
          (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "mikasa",
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

      await this.getOrkoReply(api, event, query);
    } catch (error) {
      console.error("Mikasa onChat Error:", error);
    }
  },

  onReply: async function ({ api, event }) {
    if (event.type !== "message_reply") return;
    
    // Check if the reply is intended for Mikasa
    const replyTarget = global.GoatBot.onReply.get(event.messageReply.messageID);
    if (!replyTarget || replyTarget.commandName !== "mikasa") return;

    const query = event.body?.trim();
    if (!query) return;

    await this.getOrkoReply(api, event, query);
  }
};
