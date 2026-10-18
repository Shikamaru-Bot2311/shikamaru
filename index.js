const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const qrcode = require('qrcode-terminal');

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Shikamaru Bot', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📱 ESCANEA ESTE QR CON WHATSAPP:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ SHIKAMARU BOT ESTÁ CONECTADO');
    }

    if (connection === 'close') {
      const codigo = lastDisconnect?.error?.output?.statusCode;

      if (codigo !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconectando...');
        iniciarBot();
      } else {
        console.log('⚠️ Debes volver a vincular WhatsApp.');
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const chat = msg.key.remoteJid;

      if (!chat || chat === 'status@broadcast') continue;

      const texto =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        '';

      const comando = texto.trim().toLowerCase();

      try {
        if (comando === 'menu' || comando === '.menu') {
          await sock.sendMessage(chat, {
            text:
`╭━━━〔 🦌 SHIKAMARU BOT 〕━━━╮
┃
┃ 👋 ¡Hola! Soy Shikamaru.
┃
┃ 📌 COMANDOS DISPONIBLES
┃
┃ • menu
┃ • ping
┃ • botinfo
┃ • hug
┃ • kiss
┃ • pat
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
          }, { quoted: msg });
        }

        else if (comando === 'ping' || comando === '.ping') {
          await sock.sendMessage(chat, {
            text: '🏓 ¡Pong! Shikamaru está activo.'
          }, { quoted: msg });
        }

        else if (comando === 'botinfo' || comando === '.botinfo') {
          await sock.sendMessage(chat, {
            text:
              '🦌 SHIKAMARU BOT\n\n' +
              '🤖 Estado: Activo\n' +
              '⚙️ Motor: Baileys\n' +
              '💚 ¡Gracias por usarme!'
          }, { quoted: msg });
        }

        else if (comando === 'hug' || comando === '.hug') {
          await sock.sendMessage(chat, {
            text: '🫂 ¡Un abrazo para ti!'
          }, { quoted: msg });
        }

        else if (comando === 'kiss' || comando === '.kiss') {
          await sock.sendMessage(chat, {
            text: '😘 ¡Un besito!'
          }, { quoted: msg });
        }

        else if (comando === 'pat' || comando === '.pat') {
          await sock.sendMessage(chat, {
            text: '🐱 *Shikamaru te da unas palmaditas en la cabeza.*'
          }, { quoted: msg });
                            }
