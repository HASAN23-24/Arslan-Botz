const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

let cooldowns = {}; // spam control

// Helper function for cooldown check
function isOnCooldown(user) {
    if (!cooldowns[user]) return false;
    return Date.now() - cooldowns[user] < (config.COOLDOWN_TIME || 60000); // default 60s
}

function setCooldown(user) {
    cooldowns[user] = Date.now();
}

// Start flow
cmd({
    pattern: "pkg",
    react: "📦",
    desc: "Start package activation flow",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, args }) => {
    try {
        const sender = m.sender || from;
        if (isOnCooldown(sender)) return conn.sendMessage(from, { text: "⏳ Please wait before starting again." }, { quoted: mek });

        if (!args[0]) return conn.sendMessage(from, { text: "📌 Usage: .pkg <03XXXXXXXXX>" }, { quoted: mek });

        setCooldown(sender);

        const res = await axios.post(`${config.WEBFLOW_API}/start`, { number: args[0] });
        conn.sendMessage(from, { text: `✅ Number submitted. Please send OTP:\n.flowotp <code>` }, { quoted: mek });

    } catch (err) {
        console.error(err);
        conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
    }
});

// Verify OTP
cmd({
    pattern: "otp",
    react: "🔑",
    desc: "Verify OTP for flow",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, args }) => {
    try {
        if (!args[0]) return conn.sendMessage(from, { text: "📌 Usage: .flowotp <OTP>" }, { quoted: mek });

        const res = await axios.post(`${config.WEBFLOW_API}/verify-otp`, { otp: args[0] });
        conn.sendMessage(from, { text: `✅ OTP verified. Now select option:\n.flowopt <1 or 2>` }, { quoted: mek });

    } catch (err) {
        console.error(err);
        conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
    }
});

// Choose option
cmd({
    pattern: "selectpkg",
    react: "⚙️",
    desc: "Select option for package",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, args }) => {
    try {
        if (!args[0]) return conn.sendMessage(from, { text: "📌 Usage: .flowopt <1 or 2>" }, { quoted: mek });

        const res = await axios.post(`${config.WEBFLOW_API}/choose-option`, { option: args[0] });
        conn.sendMessage(from, { text: `✅ Option selected. Now activate:\n.flowgo` }, { quoted: mek });

    } catch (err) {
        console.error(err);
        conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
    }
});

// Activate
cmd({
    pattern: "flowgo",
    react: "🚀",
    desc: "Activate package",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        let success = false;
        let attempts = 0;
        const maxAttempts = config.MAX_RETRIES || 5;

        while (!success && attempts < maxAttempts) {
            attempts++;
            try {
                const res = await axios.post(`${config.WEBFLOW_API}/activate`);
                if (res.data && res.data.success) {
                    success = true;
                    conn.sendMessage(from, { text: `🎉 Package activated successfully!` }, { quoted: mek });
                } else {
                    await new Promise(r => setTimeout(r, 3000)); // wait before retry
                }
            } catch (err) {
                await new Promise(r => setTimeout(r, 3000));
            }
        }

        if (!success) conn.sendMessage(from, { text: "❌ Failed to activate after several tries." }, { quoted: mek });

    } catch (err) {
        console.error(err);
        conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
    }
});
