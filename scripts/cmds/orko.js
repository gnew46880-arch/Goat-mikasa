const axios = require("axios");

module.exports = {
  config: {
    name: "orko",
    version: "1.4",
    author: "Zihad Ahmed",
    countDown: 3,
    role: 0,
    shortDescription: "Chat with Orko AI",
    longDescription: "Converse with Orko AI, powered by Vercel.",
    category: "AI",
    guide: "Simply type 'orko <message>', use command, or reply to Orko."
  },

  // Awesome, natural Banglish random messages
  randomCallMessages: [
    "Arey mama, amake dakla ken? 🤔 Kono dorkar asilo naki?",
    "Ki re mama! 😎 Orko হাজির! Bolo ki help lagbe.",
    "Haan boss, shunsi toh! 🤙 Ki kora jay bolo?",
    "Arey mama, evabe daan-bam theke dakcho ken? 😂 Ki obostha?",
    "Bolo mama! 🚀 Tomar ki obostha, ki niye kotha bolba?",
    "Orko চলে এসেছে! 🎯 Ki shombad bolo mama?",
    "Haan re mama, bolo ki shomossha? 😌",
    "Ami ekhanei ashi mama! 🦾 Ki kaj bolte hobe?",
    "Dak shunlam mama! ⚡ Ki kora lagbe ekhon?",
    "Bolo boss, ki khabor? 💻 Shob thikthak toh?","আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
                "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄", "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
                "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
                "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺", "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
                "বলো কি করতে পারি তোমার জন্য 😚", "কথা দেও আমাকে পটাবা...!! 😌", 
                "বার বার Disturb করেছিস কোনো 😾, আমার জানু এর সাথে ব্যাস্ত আসি 😋", "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
                "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒", "ওই তুমি single না?🫵🤨 😑😒", "বলো জানু 😒", "Meow🐤",
                "আর কত বার ডাকবা ,শুনছি তো 🤷🏻‍♀", "কি হলো, মিস টিস করচ্ছো নাকি 🤣", "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
                "আজকে আমার mন ভালো নেই 🙉", "আমি হাজারো মশার Crush😓", "প্রেম করার বয়সে লেখাপড়া করতেছি, রেজাল্ট তো খা/রা'প হবেই.!🙂",
                "আমার ইয়ারফোন চু'রি হয়ে গিয়েছে!! কিন্তু চোর'কে গা-লি দিলে আমার বন্ধু রেগে যায়!'🙂",
                "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣", "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
                "মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚", "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
                " কি গো সোনা আমাকে ডাকছ কেনো", "বার বার আমাকে ডাকস কেন😡","babu khuda lagse🥺", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ", 
                "🐒🐒🐒", "bye 😼", "mb ney bye", "meww",
                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", 
                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏", "গোসল করে আসো যাও😑😩", "অ্যাসলামওয়ালিকুম",
                "কেমন আসো", "বলেন sir__😌", "বলেন ম্যাডাম__😌", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                "🙂🙂🙂", "এটায় দেখার বাকি সিলো_🙂🙂🙂", "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒", "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂",
                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲েবাতো__🥺", "𝗕𝗯𝘆 না জানু, বল 😌", "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒",
                "__বেশি বেবি বললে কামুর দিমু 🤭🤭", "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂", "bolo baby😒",
                "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂", "আমি তো অন্ধ কিছু দেখি না🐸 😎",
                "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣", 
                "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!🤔_নাহ মানে চুরি করতাম 😞😘"
  ],

  getRandomCallMessage: function () {
    const messages = this.randomCallMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  },

  getOrkoReply: async function (api, event, query, commandName = "orko") {
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
          "❌ Mama, server ektu jhamela korse! Abar try maro.",
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
      console.error("Orko API Error:", error);
      api.sendMessage(
        "❌ Mama, connection ektu fnaisa geche! Abar try koro.",
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
              commandName: "orko",
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
      if (!/^orko(?:\s|$)/i.test(body)) return;

      const query = body.replace(/^orko\s*/i, "").trim();

      if (!query) {
        const randomMessage = this.getRandomCallMessage();
        return api.sendMessage(
          randomMessage,
          event.threadID,
          (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "orko",
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
      console.error("Orko onChat Error:", error);
    }
  },

  onReply: async function ({ api, event }) {
    if (event.type !== "message_reply") return;
    
    // Check if the reply is intended for Orko
    const replyTarget = global.GoatBot.onReply.get(event.messageReply.messageID);
    if (!replyTarget || replyTarget.commandName !== "orko") return;

    const query = event.body?.trim();
    if (!query) return;

    await this.getOrkoReply(api, event, query);
  }
};
