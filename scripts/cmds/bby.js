const axios = require('axios');
const baseApiUrl = async () => {
    return "https://baby-apisx.vercel.app";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "jan", "suna"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    description: "update simsim api by Aryan Rayhan",
    category: "CHARTING",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nteach sticker - [Reply1], [Reply2]... OR\nteach picture - [Reply1], [Reply2]... OR\nedit [YourMessage] - [OldReply] - [NewReply] OR\nmsg [YourMessage] OR\nlist OR \nall"
    }
};

const nix = ["baby", "bby", "bot", "jan", "babu", "janu"];

async function sendAttachmentReply(api, event, attachments) {
    const attType = attachments[0]?.type;
    let endpoint = null;
    if (attType === "sticker") endpoint = "sticker";
    else if (attType === "photo" || attType === "animated_image") endpoint = "picture";
    if (!endpoint) return false;

    const a = (await axios.get(`${await baseApiUrl()}/baby/${endpoint}?senderID=${event.senderID}`)).data.reply;
    await api.sendMessage(a, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
            commandName: "bby",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
        });
    }, event.messageID);
    return true;
}

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const aryan = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            if (event.attachments && event.attachments.length > 0) {
                const handled = await sendAttachmentReply(api, event, event.attachments);
                if (handled) return;
            }
            const ran = ["babu khuda lagse🥺","ডুম ডুম টেডাও 😀", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ", 
                "🐒🐒🐒", "bye 😼", "mb ney bye", "meww",
                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", 
                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏", "গোসল করে আসো যাও😑😩", "অ্যাসলামওয়ালিকুম",
                "কেমন আসো", "বলেন sir__😌", "বলেন ম্যাডাম__😌", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                "🙂🙂🙂", "এটায় দেখার বাকি সিলো_🙂🙂🙂", "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒", "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂",
                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲েবাতো__🥺", "𝗕𝗯𝘆 না জানু, বল 😌", "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒",
                "__বেশি বেবি বললে কামুর দিমু 🤭🤭", "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂", "bolo baby😒",
                "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂", "আমি তো অন্ধ কিছু দেখি না🐸 😎",
                "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣", 
                "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!🤔_নাহ মানে চুরি করতাম 😞😘", 
                "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু 𝗯𝗯𝘆 𝗯𝗯𝘆 করিস 😉😋🤣", 
                "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗯𝘆 𝗯𝗯𝘆 করিস 😾", "তোরা যে হারে 𝗕𝗯𝘆 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑",
                "আজব তো__😒", "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀", "𝗕𝗯𝘆 বললে চাকরি থাকবে না", 
                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে টাকা দে 😑", "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲", "হটাৎ আমাকে মনে পড়লো 🙄", 
                "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿", "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤", "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                "খাওয়া দাওয়া করসো 🙄", "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈", "আরে আমি মজা করার mood এ নাই😒",
                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁", "আরে Bolo আমার জান, কেমন আসো? 😚", "একটা BF খুঁজে দাও 😿",
                "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗", "oi mama ar dakis na pilis 😿", "🐤🐤", "__ভালো হয়ে যাও 😑😒",
                "এমবি কিনে দাও না_🥺🥺", "ওই মামা_আর ডাকিস না প্লিজ", "৩২ তারিখ আমার বিয়ে 🐤", "হা বলো😒,কি করতে পারি😐😑?",
                "বলো ফুলটুশি_😘", "amr JaNu lagbe,Tumi ki single aso?", "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
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
                " কি গো সোনা আমাকে ডাকছ কেনো", "বার বার আমাকে ডাকস কেন😡"
            ];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit)
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = aryan.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const parts = aryan.replace("edit ", "").split(/\s*-\s*/);
            const editKey = parts[0]?.trim();
            const oldReply = parts[1]?.trim();
            const newReply = parts[2]?.trim();
            if (!editKey || !oldReply || !newReply) {
                return api.sendMessage('❌ | Invalid format! Use: edit [YourMessage] - [OldReply] - [NewReply]', event.threadID, event.messageID);
            }
            const dA = (await axios.get(`${link}?edit=${encodeURIComponent(editKey)}&oldReply=${encodeURIComponent(oldReply)}&replace=${encodeURIComponent(newReply)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'sticker') {
            const command = aryan.replace("teach sticker ", "").replace(/^-\s*/, "").trim();
            if (!command || command.length < 1) return api.sendMessage('❌ | Invalid format! Use: teach sticker - [Reply1], [Reply2]...', event.threadID, event.messageID);
            const tex = (await axios.get(`${await baseApiUrl()}/baby/sticker?teach=1&reply=${encodeURIComponent(command)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✅ ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'picture') {
            const command = aryan.replace("teach picture ", "").replace(/^-\s*/, "").trim();
            if (!command || command.length < 1) return api.sendMessage('❌ | Invalid format! Use: teach picture - [Reply1], [Reply2]...', event.threadID, event.messageID);
            const tex = (await axios.get(`${await baseApiUrl()}/baby/picture?teach=1&reply=${encodeURIComponent(command)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✅ ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react' && args[1] !== 'sticker' && args[1] !== 'picture') {
            [comd, command] = aryan.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            let teacherName = "Unknown";
            try {
                const userData = await usersData.get(uid);
                teacherName = userData?.name || await usersData.getName(uid) || "Unknown";
            } catch (e) {
                try {
                    teacherName = await usersData.getName(uid) || "Unknown";
                } catch (e2) {
                    teacherName = "Unknown";
                }
            }
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacherName}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = aryan.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = aryan.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (aryan.includes('amar name ki') || aryan.includes('amr nam ki') || aryan.includes('amar nam ki') || aryan.includes('amr name ki') || aryan.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${aryan}&senderID=${uid}&threadID=${event.threadID}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            if (event.attachments && event.attachments.length > 0) {
                const handled = await sendAttachmentReply(api, event, event.attachments);
                if (handled) return;
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&threadID=${event.threadID}`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        const hasTrigger = nix.some(t => body.startsWith(t));

        if (hasTrigger && event.attachments && event.attachments.length > 0) {
            const handled = await sendAttachmentReply(api, event, event.attachments);
            if (handled) return;
        }

        if (hasTrigger) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["hello 😚", "Yes bolo😀, I am here 🍂", "What's up? 🦥", "Bolo jaan ki korte pari tomar jonno","babu khuda lagse🥺","ডুম ডুম টেডাও 😀", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ", 
                "🐒🐒🐒", "bye 😼", "mb ney bye", "meww",
                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", 
                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏", "গোসল করে আসো যাও😑😩", "অ্যাসলামওয়ালিকুম",
                "কেমন আসো", "বলেন sir__😌", "বলেন ম্যাডাম__😌", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                "🙂🙂🙂", "এটায় দেখার বাকি সিলো_🙂🙂🙂", "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒", "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂",
                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲েবাতো__🥺", "𝗕𝗯𝘆 না জানু, বল 😌", "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒",
                "__বেশি বেবি বললে কামুর দিমু 🤭🤭", "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂", "bolo baby😒",
                "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂", "আমি তো অন্ধ কিছু দেখি না🐸 😎",
                "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣", 
                "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!🤔_নাহ মানে চুরি করতাম 😞😘", 
                "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু 𝗯𝗯𝘆 𝗯𝗯𝘆 করিস 😉😋🤣", 
                "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗯𝘆 𝗯𝗯𝘆 করিস 😾", "তোরা যে হারে 𝗕𝗯𝘆 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑",
                "আজব তো__😒", "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀", "𝗕𝗯𝘆 বললে চাকরি থাকবে না", 
                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে টাকা দে 😑", "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲", "হটাৎ আমাকে মনে পড়লো 🙄", 
                "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿", "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤", "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                "খাওয়া দাওয়া করসো 🙄", "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈", "আরে আমি মজা করার mood এ নাই😒",
                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁", "আরে Bolo আমার জান, কেমন আসো? 😚", "একটা BF খুঁজে দাও 😿",
                "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗", "oi mama ar dakis na pilis 😿", "🐤🐤", "__ভালো হয়ে যাও 😑😒",
                "এমবি কিনে দাও না_🥺🥺", "ওই মামা_আর ডাকিস না প্লিজ", "৩২ তারিখ আমার বিয়ে 🐤", "হা বলো😒,কি করতে পারি😐😑?",
                "বলো ফুলটুশি_😘", "amr JaNu lagbe,Tumi ki single aso?", "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
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
                " কি গো সোনা আমাকে ডাকছ কেনো", "বার বার আমাকে ডাকস কেন😡"
            ];
            if (!arr) {
                return await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&threadID=${event.threadID}`)).data.reply;
            return await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
