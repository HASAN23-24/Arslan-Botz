const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ARSLAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUFBZFY5YnE2OGhYbVVJdmpvcGUxRGxNT0xRQ3NOdWllOVg0VnFxUGUwRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicFlHMnY2WEV0UVZsSndISDFxc2V5Sm1tRGhBbVg2UkVDU2NOUjFqL05oYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZR3Q5NktFamdjS3Q2ZDRkVHovb2J2TlljYXU2RUl4YkR6RXh5OGJHRlZJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtK05BcFRCRzRLaEI2MEpIU2V3SDhsVC85amM1MHU3bVBrSCtVenhBMDJ3PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVFRjkxa2o1aitkWTNBdG1rOUZYWmRlK0txek1McDJpM3dqNm5HUCs2MnM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVyeDlneFA2OU5GNXFJYWs5WTBhR0NpV2RmZTNFYTc0THdJTVJWcnBTbDQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUlsT09ZZlU2dEVPQSsvK2Q0UkRJN3ZkWWFVckV5UFhXWTdlNzJGU0dYVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidlRuV1U4NWVob0I1VnJYdjZYZldGd2xKZGhFUUI2RWVDODFYM0laYzQyRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjYwbURIbTJDSER2SHgrdmtOczNxSVA5NlBmT1RQdzZiWUVYNmFOMTRTdnZBNVk5WVF5bVNodjY5Tm9vWWh0RGpJcGhlejJ2VVRTQWNEQlhaWmFHSGp3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjIwLCJhZHZTZWNyZXRLZXkiOiIwUldlSHgrK1YrNnlsT3hrT0hhMDZ6RXI3NWQ3dU1aQzhPVzJuVUdlQzVVPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjkyMzM5MjYxNjI2M0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI0ODZCMzQ1ODYxNjNGRTUwOTlERjdFNUExMEUyOTY5NiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzU1NDQyOTk4fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMzOTI2MTYyNjNAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiNzY2RkI0QTk1QUQ5RkFDOENFRTc1NUQyQzFFMkVBRTUifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1NTQ0Mjk5OX1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiNlk0WUwzUTgiLCJtZSI6eyJpZCI6IjkyMzM5MjYxNjI2Mzo2MkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJhcnNsYW4iLCJsaWQiOiIxNjMwODkwODU0Mjc4OTY6NjJAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNQbll3K29DRUsvZWg4VUdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJKYjQ2bFU0R3UzazlnVzJwbVlqT0hlWUVQamJUa2tRZUVsaFh3T1p5T1hFPSIsImFjY291bnRTaWduYXR1cmUiOiJPakZYSldrMzJyRzQxd3NJQVB0cXRWcXpKV0dsVUtlVHBWREd4Y3pXMjlYeS9uQkIwc1lGZmEweFlzbGlBWGppOXJsNnoxNXQ4QWpDc01vYVpwcm5Edz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiaUhzUEpLaStGQ053NjgrMW4wdmt2QXZWUnFCWGgvSFVUUitUTUpRRFdVczdRd1gvaE5McXlEV3FYdGhaY1dGUmVLWjMxK3BRVm1zV28xWHJoeWFaZ3c9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5MjMzOTI2MTYyNjM6NjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCU1crT3BWT0JydDVQWUZ0cVptSXpoM21CRDQyMDVKRUhoSllWOERtY2pseCJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FJSUNBPT0ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzU1NDQyOTk1LCJsYXN0UHJvcEhhc2giOiJQV2s1QiIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBRWg4In0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY Arslan Botz 🤍*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "true",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "true",
// true if want welcome and goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
MENTION_REPLY: process.env.MENTION_REPLY || "false",
// make true if want auto voice reply if someone menetion you 
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "",
MENU_VIDEO_URL: process.env.MENU_VIDEO_URL || "https://files.catbox.moe/wzdxwt.mp4",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "Arslan Botz",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "Arslan Botz",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "923237045910",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "*ArslanMD Official*",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ArslanMD Official ❣️*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/qpnazl.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> Zinda Hun Yar ⚡",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "923237045919",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
// make it true for auto recoding 
TAMASHA_API: "http://portal.tamashaweb.com/>:3000/flow",
FLOW_COOLDOWN_MS: 60000
};
