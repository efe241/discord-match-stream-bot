const WebSocket = require('ws');
global.WebSocket = WebSocket;

require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const StreamProxy = require('./src/streamProxy');
const { CHANNELS, findChannel } = require('./src/channels');
const { fetchLiveMatches } = require('./src/streamResolver');
const WorkerStreamer = require('./src/workerStreamer');

// --- Configuration ---
const PREFIX = process.env.PREFIX || '!';
const PROXY_PORT = parseInt(process.env.PORT || process.env.PROXY_PORT || '8999', 10);
const proxy = new StreamProxy(PROXY_PORT);

// Collect worker tokens
const workers = {};

// 1. TRT 1 Worker (or Primary)
const trtToken = process.env.TRT_TOKEN || process.env.DISCORD_TOKEN;
if (trtToken && !trtToken.includes('BURAYA')) {
  workers.trt = new WorkerStreamer('TRT 1 Yayın Botu', trtToken);
}

// 2. beIN SPORTS Worker
const beinToken = process.env.BEIN_TOKEN;
if (beinToken && !beinToken.includes('BURAYA')) {
  workers.bein = new WorkerStreamer('beIN SPORTS Yayın Botu', beinToken);
}

// 3. Canlı Maç Worker
const matchToken = process.env.MATCH_TOKEN;
if (matchToken && !matchToken.includes('BURAYA')) {
  workers.match = new WorkerStreamer('Canlı Maç Yayın Botu', matchToken);
}

// Fallback primary worker
if (Object.keys(workers).length === 0) {
  console.error('\n❌ HATA: .env dosyasında en az 1 geçerli token bulunmalıdır! (DISCORD_TOKEN veya TRT_TOKEN)');
  process.exit(1);
}

// Helper: Pick appropriate worker for channel query
function getWorkerForQuery(query) {
  const q = (query || '').toLowerCase();
  if (q.includes('bein') && workers.bein) {
    return workers.bein;
  }
  if ((q.includes('test') || q.includes('mac') || q.includes('canlimac')) && workers.match) {
    return workers.match;
  }
  if ((q.includes('trt') || q.includes('tabii')) && workers.trt) {
    return workers.trt;
  }
  // Default to first available worker
  return workers.trt || workers.bein || workers.match || Object.values(workers)[0];
}

// Start Stream Proxy
proxy.start().catch(err => {
  console.error('[Hata] Proxy başlatılamadı:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('[Beklenmeyen Hata]:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('[İşlenmeyen Rejection]:', err?.message || err);
});

// Helper: Safe reply that won't crash if permissions are missing
async function safeReply(message, content) {
  try {
    return await message.reply(content);
  } catch (err) {
    try {
      return await message.channel.send(content);
    } catch (e) {
      return null;
    }
  }
}

async function safeEdit(msgObj, content) {
  if (!msgObj) return;
  try {
    await msgObj.edit(content);
  } catch (e) {}
}

// Helper: Robust voice channel finder
function findSenderVoiceChannel(message) {
  if (message.member?.voice?.channel) return message.member.voice.channel;
  if (message.guild) {
    const vs = message.guild.voiceStates.cache.get(message.author.id);
    if (vs?.channel) return vs.channel;
    for (const [, channel] of message.guild.channels.cache) {
      if ((channel.isVoice?.() || channel.type === 'GUILD_VOICE') && channel.members?.has(message.author.id)) {
        return channel;
      }
    }
  }
  return null;
}

// Initialize and attach command listeners to all workers
async function startAllWorkers() {
  console.log('====================================================');
  console.log('🚀 Çoklu Kanal Yayın Sistemi Başlatılıyor...');
  console.log(`📡 Aktif Worker Sayısı: ${Object.keys(workers).length}`);
  console.log('====================================================');

  for (const [key, worker] of Object.entries(workers)) {
    try {
      await worker.init();
      attachCommandListener(worker);
    } catch (e) {
      console.error(`[Worker Başlatılamadı] ${key}:`, e.message);
    }
  }
}

function attachCommandListener(activeWorker) {
  const client = activeWorker.client;

  client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Log received command on first primary worker only
    if (activeWorker === Object.values(workers)[0]) {
      console.log(`[📩 Komut Alındı]: [${message.guild ? message.guild.name : 'DM'}] ${message.author.tag}: ${message.content}`);
    }

    // Find caller's voice channel
    let memberVoice = findSenderVoiceChannel(message);
    if (!memberVoice && message.guild) {
      try {
        const fetchedMember = await message.guild.members.fetch(message.author.id).catch(() => null);
        if (fetchedMember?.voice?.channel) memberVoice = fetchedMember.voice.channel;
      } catch (e) {}
    }

    // Direct channel shortcut support (e.g. !trt1, !ssport1, !ssport2, !tabiispor, !tv85, !exxen, !atv, !bein1)
    const directChannelShortcut = findChannel(command);
    if (directChannelShortcut && !['kanallar', 'yardim', 'help', 'durum', 'durdur', 'stop', 'cikis', 'ses', 'yayin', 'maclar', 'yayin_link'].includes(command)) {
      if (!memberVoice) {
        if (activeWorker === Object.values(workers)[0]) {
          return safeReply(message, '❌ **Yayını başlatmak için lütfen önce bir ses kanalına katılın!**');
        }
        return;
      }
      const targetWorker = getWorkerForQuery(directChannelShortcut.id);
      if (targetWorker !== activeWorker) return;

      const waitMsg = await safeReply(message, `⏳ **${directChannelShortcut.name}** canlı yayını **${memberVoice.name}** odasında açılıyor... *(Hesap: ${targetWorker.client.user.tag})*`);
      try {
        let streamSource = directChannelShortcut.directUrl;
        if (!streamSource) {
          await proxy.setTargetChannel(directChannelShortcut);
          streamSource = proxy.getStreamUrl();
        }
        await targetWorker.startStreaming(memberVoice, streamSource, directChannelShortcut.name, 'camera');
        return safeEdit(waitMsg, `🔴 **${directChannelShortcut.name}** yayını **${memberVoice.name}** kanalında başarıyla açıldı! 🎉\n*(Yayınlayan Hesap: ${targetWorker.client.user.tag})*`);
      } catch (err) {
        console.error(err);
        return safeEdit(waitMsg, `❌ **Yayın başlatılamadı:** ${err.message}`);
      }
    }

    // --- !yayin <kanal/link> ---
    if (command === 'yayin' || command === 'stream' || command === 'mac') {
      const query = args.join(' ');

      if (!memberVoice) {
        if (activeWorker === Object.values(workers)[0]) {
          return safeReply(message, '❌ **Yayını başlatmak için lütfen önce bir ses kanalına katılın!**');
        }
        return;
      }

      if (!query) {
        if (activeWorker === Object.values(workers)[0]) {
          let listText = '**📺 Mevcut Canlı Kanallar & Çoklu Yayın:**\n';
          CHANNELS.forEach(ch => {
            listText += `• \`${PREFIX}yayin ${ch.id}\` ➜ **${ch.name}** (${ch.category})\n`;
          });
          listText += `\n🔗 **Direkt Linkle Başlatma:** \`${PREFIX}yayin_link <url>\``;
          listText += `\n⚽ **Canlı Maçlar:** \`${PREFIX}maclar\``;
          listText += `\n⏹️ **Yayını Durdurma:** \`${PREFIX}durdur\` (Sadece @efe_tr_24)`;
          return safeReply(message, listText);
        }
        return;
      }

      // Check pre-defined channel
      const channelObj = findChannel(query);
      if (channelObj) {
        const targetWorker = getWorkerForQuery(channelObj.id);
        if (targetWorker !== activeWorker) return; // Only designated worker executes

        const waitMsg = await safeReply(message, `⏳ **${channelObj.name}** canlı yayını **${memberVoice.name}** odasında açılıyor... *(Hesap: ${targetWorker.client.user.tag})*`);
        try {
          let streamSource;
          if (channelObj.directUrl) {
            streamSource = channelObj.directUrl;
          } else {
            await proxy.setTargetChannel(channelObj);
            streamSource = proxy.getStreamUrl();
          }

          await targetWorker.startStreaming(memberVoice, streamSource, channelObj.name, 'camera');
          return safeEdit(waitMsg, `🔴 **${channelObj.name}** yayını **${memberVoice.name}** kanalında başarıyla açıldı! 🎉\n*(Yayınlayan Hesap: ${targetWorker.client.user.tag})*`);
        } catch (err) {
          console.error(err);
          return safeEdit(waitMsg, `❌ **Yayın başlatılamadı:** ${err.message}`);
        }
      }

      // Check direct URL
      if (query.startsWith('http')) {
        const targetWorker = getWorkerForQuery(query);
        if (targetWorker !== activeWorker) return;

        const waitMsg = await safeReply(message, `⏳ Canlı yayın açılıyor... *(Hesap: ${targetWorker.client.user.tag})*`);
        try {
          let streamSource = query;
          let title = 'Canlı Yayın';
          if (query.includes('tabii.com')) {
            streamSource = 'https://tv-trt1.medya.trt.com.tr/master_720.m3u8';
            title = 'TRT 1 (Tabii)';
          } else if (query.includes('cdnlivetv.tv') && query.includes('player')) {
            await proxy.setTargetCustomUrl(query, 'Canlı Yayın');
            streamSource = proxy.getStreamUrl();
          }
          await targetWorker.startStreaming(memberVoice, streamSource, title, 'camera');
          return safeEdit(waitMsg, `🔴 **${title}** yayını **${memberVoice.name}** kanalında açıldı! 🎉\n*(Hesap: ${targetWorker.client.user.tag})*`);
        } catch (err) {
          return safeEdit(waitMsg, `❌ Hata: ${err.message}`);
        }
      }

      if (activeWorker === Object.values(workers)[0]) {
        return safeReply(message, `❌ \`${query}\` adında bir kanal bulunamadı. Tüm kanallar için: \`${PREFIX}kanallar\``);
      }
    }

    // --- !yayin_link <url> ---
    if (command === 'yayin_link' || command === 'link') {
      const streamUrl = args[0];
      if (!memberVoice) {
        if (activeWorker === Object.values(workers)[0]) {
          return safeReply(message, '❌ **Lütfen önce bir ses kanalına katılın!**');
        }
        return;
      }
      if (!streamUrl) {
        if (activeWorker === Object.values(workers)[0]) {
          return safeReply(message, `❌ Lütfen bir yayın linki girin. Örnek: \`${PREFIX}yayin_link http://92.113.151.217/test3/index.m3u8\``);
        }
        return;
      }

      const targetWorker = getWorkerForQuery(streamUrl);
      if (targetWorker !== activeWorker) return;

      const waitMsg = await safeReply(message, `⏳ Direkt link üzerinden yayın açılıyor...`);
      try {
        let streamSource = streamUrl;
        let title = 'Direkt Canlı Yayın';
        if (streamUrl.includes('tabii.com')) {
          streamSource = 'https://tv-trt1.medya.trt.com.tr/master_720.m3u8';
          title = 'TRT 1 (Tabii)';
        } else if (streamUrl.includes('cdnlivetv.tv') && streamUrl.includes('player')) {
          await proxy.setTargetCustomUrl(streamUrl, 'Direkt Canlı Yayın');
          streamSource = proxy.getStreamUrl();
        }

        await targetWorker.startStreaming(memberVoice, streamSource, title, 'camera');
        return safeEdit(waitMsg, `🔴 Canlı yayın **${memberVoice.name}** kanalında başarıyla açıldı! 🎉\n• **Kaynak:** \`${streamUrl}\`\n• **Hesap:** ${targetWorker.client.user.tag}`);
      } catch (err) {
        console.error(err);
        return safeEdit(waitMsg, `❌ **Yayın başlatılamadı:** ${err.message}`);
      }
    }

    // --- !kanallar ---
    if (command === 'kanallar' || command === 'channels') {
      if (activeWorker === Object.values(workers)[0]) {
        let text = '📋 **İzlenebilir Canlı Kanallar (Çoklu Yayın Destekli):**\n\n';
        CHANNELS.forEach(ch => {
          text += `${ch.icon} **${ch.name}** — Komut: \`${PREFIX}yayin ${ch.id}\`\n`;
        });
        text += `\n💡 *Farklı ses kanallarında aynı anda TRT 1 ve beIN SPORTS yayınlayabilirsiniz!*`;
        return safeReply(message, text);
      }
    }

    // --- !maclar ---
    if (command === 'maclar' || command === 'matches') {
      if (activeWorker === Object.values(workers)[0]) {
        const waitMsg = await safeReply(message, '⏳ Sitedeki güncel canlı maçlar çekiliyor...');
        try {
          const matches = await fetchLiveMatches();
          if (!matches || matches.length === 0) {
            return safeEdit(waitMsg, 'ℹ️ Şu anda sitede aktif canlı maç etkinliği bulunamadı. 7/24 spor kanallarını izlemek için `!kanallar` yazabilirsiniz.');
          }

          let text = '⚽ **Sitedeki Güncel Canlı Maçlar:**\n\n';
          matches.slice(0, 10).forEach((m, idx) => {
            text += `**${idx + 1}.** ${m.name}\n   🏆 ${m.tournament} | ⏰ Saat: ${m.time} | 📺 Kanal: **${m.channelName}**\n   ➡️ Başlatmak için: \`${PREFIX}yayin ${m.url}\`\n\n`;
          });
          return safeEdit(waitMsg, text);
        } catch (e) {
          return safeEdit(waitMsg, `❌ Maçlar alınırken hata oluştu: ${e.message}`);
        }
      }
    }

    // --- !durdur / !stop (Sadece efe_tr_24 yetkili) ---
    if (command === 'durdur' || command === 'stop' || command === 'cikis' || command === 'leave') {
      const isOwner = message.author.username.toLowerCase() === 'efe_tr_24' || 
                      message.author.tag.toLowerCase().includes('efe_tr_24');

      if (!isOwner) {
        if (activeWorker === Object.values(workers)[0]) {
          return safeReply(message, '⛔ **Yetkisiz İşlem:** Yayını sadece **@efe_tr_24** durdurabilir!');
        }
        return;
      }

      // Stop all active streams across all workers
      let stoppedCount = 0;
      for (const worker of Object.values(workers)) {
        if (worker.activeChannelName || worker.streamer.voiceConnection) {
          await worker.leaveVoice();
          stoppedCount++;
        }
      }

      if (activeWorker === Object.values(workers)[0]) {
        if (stoppedCount > 0) {
          return safeReply(message, `⏹️ **Tüm aktif yayınlar durduruldu ve hesaplar ses kanallarından ayrıldı.**`);
        } else {
          return safeReply(message, 'ℹ️ Zaten aktif bir yayın bulunmuyor.');
        }
      }
    }

    // --- !durum ---
    if (command === 'durum' || command === 'status') {
      if (activeWorker === Object.values(workers)[0]) {
        let text = '📊 **Çoklu Yayın Durumu:**\n\n';
        for (const [key, worker] of Object.entries(workers)) {
          if (worker.activeChannelName) {
            text += `🔴 **${worker.name} (${worker.client.user?.tag}):** \n   • Kanal: **${worker.activeChannelName}**\n   • Ses Odası: **${worker.activeVoiceChannel?.name || 'Bilinmiyor'}**\n`;
          } else {
            text += `⚪ **${worker.name} (${worker.client.user?.tag}):** Boşta (Yayın Yok)\n`;
          }
        }
        return safeReply(message, text);
      }
    }
  });
}

// --- Graceful Process Exit Cleanup ---
async function handleShutdown() {
  console.log('\n[Kapatılıyor] Tüm yayınlar kapatılıyor ve ses kanallarından temizce çıkılıyor...');
  for (const worker of Object.values(workers)) {
    try {
      await worker.leaveVoice();
    } catch (e) {}
    try {
      worker.client.destroy();
    } catch (e) {}
  }
  try {
    proxy.stop();
  } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

startAllWorkers().catch(err => {
  console.error('\n❌ Başlatma Hatası:', err.message);
});
