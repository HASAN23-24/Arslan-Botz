// commands/subscribe.js
import fs from "fs";
import axios from "axios";
import path from "path";

const DATA_DIR = path.resolve("./data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const STATE_FILE = path.join(DATA_DIR, "otp_state.json");
const PREMIUM_FILE = path.join(DATA_DIR, "premium_users.json");

function loadJson(file) {
  try { return JSON.parse(fs.readFileSync(file,"utf8")); }
  catch { return {}; }
}
function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data,null,2));
}

const API_BASE = process.env.OTP_API_BASE || "http://portal.tamashaweb.com/"; // <-- change to your actual API

// helper
function isPremium(jid) {
  const data = loadJson(PREMIUM_FILE);
  if (!data[jid]) return false;
  return data[jid].expiry > Date.now();
}

cmd({
  pattern: "subscribe",
  desc: "Subscribe to monthly package (number → OTP → auto-activate)",
  react: "📲",
  category: "subscription",
  filename: __filename
}, async (conn, mek, m, { text, prefix, sender }) => {
  const user = sender; // e.g. '923001234567@s.whatsapp.net' or whatever your handler uses
  const plainUser = user.split("@")[0];

  let states = loadJson(STATE_FILE);

  // If user already premium
  if (isPremium(user)) {
    return await conn.sendMessage(m.chat, { text: "✅ Aap pehle se premium ho. Use: .check" }, { quoted: mek });
  }

  // If no state -> ask for number
  if (!states[user] || states[user].step === "idle") {
    states[user] = { step: "await_number", createdAt: Date.now() };
    saveJson(STATE_FILE, states);
    return await conn.sendMessage(m.chat, { text: "📞 Apna mobile number bhejein (example: 03001234567)\n\nType `.subscribe 0300xxxxxxx` or reply with the number." }, { quoted: mek });
  }

  // If user provided inline number with command: ".subscribe 0300..."
  if (text && states[user] && states[user].step === "await_number" && /^\d{10,13}$/.test(text.trim())) {
    const number = text.trim();
    // send OTP via backend
    try {
      const resp = await axios.post(`${API_BASE}/send-otp`, { number });
      if (!resp.data || resp.data.ok) {
        // store tx and number
        states[user] = { step: "await_otp", number, tx: resp.data?.tx || null, createdAt: Date.now() };
        saveJson(STATE_FILE, states);
        await conn.sendMessage(m.chat, { text: `📩 OTP sent to ${number}. Please reply with the OTP (example: .subscribe 123456)` }, { quoted: mek });
        return;
      } else {
        return await conn.sendMessage(m.chat, { text: `❌ Error sending OTP: ${JSON.stringify(resp.data)}` }, { quoted: mek });
      }
    } catch (e) {
      console.error(e);
      return await conn.sendMessage(m.chat, { text: `❌ Server error sending OTP: ${e.message}` }, { quoted: mek });
    }
  }

  // If we are at await_number but user replied with plain text number (not using command)
  if (states[user] && states[user].step === "await_number" && !text) {
    // maybe user replied with plain message; check last message content in mek.message?
    // Fallback: ask explicit instruction
    return await conn.sendMessage(m.chat, { text: "📌 Please send your number like: `.subscribe 03001234567`" }, { quoted: mek });
  }

  // If user sends OTP inline: ".subscribe 123456"
  if (text && states[user] && states[user].step === "await_otp" && /^\d{4,6}$/.test(text.trim())) {
    const otp = text.trim();
    const { number, tx } = states[user];
    try {
      const verify = await axios.post(`${API_BASE}/verify-otp`, { number, otp, tx });
      if (!verify.data || !verify.data.ok) {
        // provider returned bad
        const err = verify.data?.error || JSON.stringify(verify.data);
        return await conn.sendMessage(m.chat, { text: `❌ OTP verification failed: ${err}` }, { quoted: mek });
      }

      // Verified -> auto-activate monthly via backend
      const activate = await axios.post(`${API_BASE}/activate-monthly`, { customerId: verify.data.customerId });
      if (!activate.data || !activate.data.ok) {
        return await conn.sendMessage(m.chat, { text: `❌ Activation failed: ${JSON.stringify(activate.data)}` }, { quoted: mek });
      }

      // Save premium
      const premium = loadJson(PREMIUM_FILE);
      const expiry = Date.now() + 30*24*60*60*1000; // 30 days
      premium[user] = { number, activatedAt: new Date().toISOString(), expiry, receipt: activate.data.activated };
      saveJson(PREMIUM_FILE, premium);

      // Clear state
      states[user] = { step: "idle" };
      saveJson(STATE_FILE, states);

      // Reply with success & details
      return await conn.sendMessage(m.chat, { text:
        `✅ Monthly package activated!\n\nNumber: ${number}\nDeducted: ${activate.data.activated.deducted || "N/A"}\nValidity: 30 days\n\nThank you!` }, { quoted: mek });

    } catch (e) {
      console.error(e);
      return await conn.sendMessage(m.chat, { text: `❌ Error during verify/activate: ${e.message}` }, { quoted: mek });
    }
  }

  // If user at any other step
  if (states[user] && states[user].step === "await_otp") {
    return await conn.sendMessage(m.chat, { text: "📩 OTP ka intezar hai. Please reply with the OTP like: `.subscribe 123456`" }, { quoted: mek });
  }

  // fallback
  states[user] = { step: "idle" };
  saveJson(STATE_FILE, states);
  return await conn.sendMessage(m.chat, { text: "⚠️ Something went wrong. Please try again: `.subscribe`" }, { quoted: mek });
});
