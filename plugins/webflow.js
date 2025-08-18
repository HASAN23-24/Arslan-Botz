const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

const COOLDOWN_MS = config.FLOW_COOLDOWN_MS || 60000;
const lastStart = new Map();  // userJid -> ts
const states = new Map();     // userJid -> { sessionId, number, step }

const now = () => Date.now();
const onCd = (m, k) => m.has(k) && (now() - m.get(k) < COOLDOWN_MS);
const touch = (m, k) => m.set(k, now());
const sid = jid => Buffer.from(jid).toString('base64').replace(/=/g,'');

// 1) Start: send OTP
cmd({
  pattern: "pkg",
  react: "📦",
  desc: "Tamasha Monthly (start) — sends OTP",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const user = m.sender || from;
    const numberRaw = (args[0] || "").trim();
    if (!numberRaw) return reply("📌 Usage: `.pkg 03XXXXXXXXX`");
    const number = numberRaw.replace(/\D/g,'');
    if (!/^03\d{9}$/.test(number)) return reply("❌ Sahi number do: 03XXXXXXXXX");

    if (onCd(lastStart, user)) return reply("⏳ Thora wait karke phir try karo.");

    const sessionId = sid(user);
    const r = await axios.post(`${config.TAMASHA_API}/start`, { sessionId, number });

    states.set(user, { sessionId, number, step: 'otp' });
    touch(lastStart, user);

    return reply(`✅ OTP bheja gaya *${number}* par.\nAb OTP bhejo: \`.otp 123456\`\n(Verify hote hi Monthly Offer auto-activate hoga)`);
  } catch (e) {
    return reply(`❌ Start failed: ${e?.response?.data?.error || e.message}`);
  }
});

// 2) Submit OTP -> backend auto picks Monthly + activates
cmd({
  pattern: "otp",
  react: "🔑",
  desc: "Submit OTP to complete Tamasha Monthly activation",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const user = m.sender || from;
    const st = states.get(user);
    if (!st || st.step !== 'otp') return reply("ℹ️ Pehle `.pkg 03XXXXXXXXX` bhejo.");
    const otp = (args[0] || '').trim();
    if (!/^\d{4,8}$/.test(otp)) return reply("❌ Valid OTP bhejo (4–8 digits).");

    const r = await axios.post(`${config.TAMASHA_API}/verify-otp`, { sessionId: st.sessionId, otp });

    if (r.data?.success) {
      states.delete(user);
      return reply(`🎉 Activated: *Tamasha Monthly*\nNumber: ${st.number}\n${r.data?.message || ''}`);
    } else {
      return reply(`⚠️ ${r.data?.message || 'Activation failed/pending.'}`);
    }
  } catch (e) {
    return reply(`❌ OTP/Activate failed: ${e?.response?.data?.error || e.message}`);
  }
});

// optional helpers
cmd({
  pattern: "flowstatus",
  react: "ℹ️",
  desc: "Show current Tamasha flow status",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const st = states.get(m.sender || from);
  if (!st) return reply("No active flow.");
  return reply(`Step: ${st.step}\nNumber: ${st.number}`);
});

cmd({
  pattern: "flowcancel",
  react: "🛑",
  desc: "Cancel current Tamasha flow",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  states.delete(m.sender || from);
  return reply("✅ Flow cleared (local).");
});
