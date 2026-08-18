const http = require('http');
const { resolveStreamUrl, fetchLiveMatches } = require('./streamResolver');
const { CHANNELS } = require('./channels');

class StreamProxy {
  constructor(port = 8999) {
    this.port = port;
    this.server = null;
    this.currentChannel = null;
    this.currentCustomUrl = null;
    this.currentResolvedM3u8 = null;
    this.lastResolvedTime = 0;
  }

  start() {
    if (this.server) return Promise.resolve(this.getStreamUrl());

    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        try {
          const reqUrl = new URL(req.url, `http://localhost:${this.port}`);

          // --- 1. WEB PLAYER HTML (ROOT & /player) ---
          if (reqUrl.pathname === '/' || reqUrl.pathname === '/player') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(this.renderPlayerHtml());
          }

          // --- 2. KANALLAR VE CANLI MAÇLAR API ---
          if (reqUrl.pathname === '/api/channels') {
            const matches = await fetchLiveMatches().catch(() => []);
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            return res.end(JSON.stringify({ channels: CHANNELS, matches }));
          }

          // --- 3. DİNAMİK KANAL M3U8 ÇÖZÜCÜ API ---
          if (reqUrl.pathname === '/api/stream-url') {
            const chId = reqUrl.searchParams.get('id');
            const customUrl = reqUrl.searchParams.get('url');

            let finalUrl = null;
            if (customUrl) {
              finalUrl = customUrl;
            } else if (chId) {
              const ch = CHANNELS.find(c => c.id === chId);
              if (ch) {
                if (ch.directUrl) {
                  finalUrl = ch.directUrl;
                } else {
                  finalUrl = await resolveStreamUrl(ch.name, ch.code || 'tr');
                }
              }
            }

            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            return res.end(JSON.stringify({ url: finalUrl }));
          }

          // --- 4. MASTER / LIVE PLAYLIST ---
          if (reqUrl.pathname === '/live.m3u8') {
            const m3u8Content = await this.getFreshM3u8();
            return this.sendRewrittenM3u8(m3u8Content, res);
          }

          // --- 5. SEGMENT PROXY (.ts) ---
          if (reqUrl.pathname === '/segment.ts') {
            const segTarget = reqUrl.searchParams.get('url');
            if (!segTarget) {
              res.writeHead(400);
              return res.end('Missing segment url');
            }

            const fullUrl = segTarget.startsWith('http') ? segTarget : `https://cdnlivetv.tv${segTarget}`;
            const segRes = await fetch(fullUrl, {
              headers: {
                'Referer': 'https://cdnlivetv.tv/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              }
            });

            res.writeHead(segRes.status, {
              'Content-Type': 'video/MP2T',
              'Access-Control-Allow-Origin': '*'
            });

            const arrayBuffer = await segRes.arrayBuffer();
            return res.end(Buffer.from(arrayBuffer));
          }

          res.writeHead(404);
          res.end('Not Found');
        } catch (err) {
          console.error('[StreamProxy Error]:', err.message);
          res.writeHead(500);
          res.end(err.message);
        }
      });

      this.server.listen(this.port, '0.0.0.0', () => {
        console.log(`[StreamProxy] Canlı Maç Oynatıcı & Proxy hazır: http://localhost:${this.port}`);
        resolve(this.getStreamUrl());
      });

      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`[StreamProxy] Port ${this.port} kullanımda.`);
          resolve(this.getStreamUrl());
        } else {
          reject(err);
        }
      });
    });
  }

  async setTargetChannel(channelObj) {
    this.currentChannel = channelObj;
    this.currentCustomUrl = null;
    this.currentResolvedM3u8 = null;
    this.lastResolvedTime = 0;
    return this.getStreamUrl();
  }

  async setTargetCustomUrl(customUrl, name = 'Özel Yayın') {
    this.currentChannel = { name, code: 'tr' };
    this.currentCustomUrl = customUrl;
    this.currentResolvedM3u8 = null;
    this.lastResolvedTime = 0;
    return this.getStreamUrl();
  }

  getStreamUrl() {
    return `http://localhost:${this.port}/live.m3u8`;
  }

  getPlayerUrl(channelId = 'test3') {
    return `http://localhost:${this.port}/player?ch=${channelId}`;
  }

  async getFreshM3u8() {
    const now = Date.now();
    if (!this.currentResolvedM3u8 || now - this.lastResolvedTime > 120000) {
      if (this.currentChannel?.directUrl) {
        this.currentResolvedM3u8 = this.currentChannel.directUrl;
      } else if (this.currentCustomUrl) {
        if (this.currentCustomUrl.includes('.m3u8')) {
          this.currentResolvedM3u8 = this.currentCustomUrl;
        } else {
          this.currentResolvedM3u8 = await resolveStreamUrl(this.currentChannel.name, 'tr', this.currentCustomUrl);
        }
      } else if (this.currentChannel) {
        this.currentResolvedM3u8 = await resolveStreamUrl(this.currentChannel.name, this.currentChannel.code);
      } else {
        this.currentResolvedM3u8 = 'http://92.113.151.217/test3/index.m3u8';
      }
      this.lastResolvedTime = now;
    }

    const cdnRes = await fetch(this.currentResolvedM3u8, {
      headers: {
        'Referer': 'https://cdnlivetv.tv/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!cdnRes.ok) {
      if (this.currentCustomUrl) {
        this.currentResolvedM3u8 = await resolveStreamUrl(this.currentChannel.name, 'tr', this.currentCustomUrl);
      } else {
        this.currentResolvedM3u8 = await resolveStreamUrl(this.currentChannel.name, this.currentChannel.code);
      }
      this.lastResolvedTime = Date.now();
      const retryRes = await fetch(this.currentResolvedM3u8, {
        headers: {
          'Referer': 'https://cdnlivetv.tv/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      return await retryRes.text();
    }

    return await cdnRes.text();
  }

  sendRewrittenM3u8(text, res) {
    const lines = text.split('\n');
    const rewritten = lines.map(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return line;
      return `http://localhost:${this.port}/segment.ts?url=${encodeURIComponent(line)}`;
    }).join('\n');

    res.writeHead(200, {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(rewritten);
  }

  renderPlayerHtml() {
    return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SporX VIP Canlı Maç & TV Oynatıcı</title>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <style>
    :root {
      --bg-dark: #08090c;
      --bg-card: #12141a;
      --primary: #ff1e38;
      --accent: #00ff88;
      --text: #ffffff;
      --text-muted: #8e95a5;
    }
    * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
    body { background: var(--bg-dark); color: var(--text); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    header {
      background: rgba(18, 20, 26, 0.9); backdrop-filter: blur(10px);
      padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .brand { font-size: 20px; font-weight: 900; display:flex; align-items:center; gap:8px; }
    .brand span { color: var(--primary); }
    .live-badge {
      background: var(--primary); color: #fff; font-size: 11px; font-weight: 800;
      padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }

    .main-layout { display: flex; flex: 1; height: calc(100vh - 60px); }
    
    .player-container {
      flex: 1; background: #000; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;
    }
    video { width: 100%; height: 100%; object-fit: contain; background: #000; }

    .sidebar {
      width: 340px; background: var(--bg-card); border-left: 1px solid rgba(255,255,255,0.06);
      display: flex; flex-direction: column; overflow: hidden;
    }
    .sidebar-header { padding: 16px; font-weight: 800; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text-muted); text-transform: uppercase; }
    .channel-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    
    .channel-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
      padding: 12px 16px; border-radius: 12px; cursor: pointer; transition: 0.2s;
      display: flex; justify-content: space-between; align-items: center;
    }
    .channel-card:hover, .channel-card.active {
      background: rgba(255,30,56,0.12); border-color: var(--primary); transform: translateX(4px);
    }
    .channel-title { font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .channel-cat { font-size: 11px; color: var(--text-muted); }

    .custom-input-bar {
      padding: 12px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05);
      display: flex; gap: 8px;
    }
    .custom-input-bar input {
      flex: 1; background: #08090c; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      padding: 8px 12px; color: #fff; font-size: 12px; outline: none;
    }
    .custom-input-bar button {
      background: var(--primary); color: #fff; border: none; border-radius: 8px;
      padding: 8px 16px; font-weight: 800; cursor: pointer; font-size: 12px;
    }
    @media (max-width: 800px) {
      .main-layout { flex-direction: column; }
      .sidebar { width: 100%; height: 260px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Spor<span>X</span> Canlı Maç Hub</div>
    <div class="live-badge">🔴 CANLI YAYIN</div>
  </header>

  <div class="main-layout">
    <div class="player-container">
      <video id="videoPlayer" controls autoplay playsinline></video>
    </div>

    <div class="sidebar">
      <div class="sidebar-header">📺 Canlı Kanallar & Maçlar</div>
      <div class="channel-list" id="channelList">
        <div style="text-align:center; padding:20px; color:#888;">Kanallar yükleniyor...</div>
      </div>
      <div class="custom-input-bar">
        <input type="text" id="customM3u8Input" placeholder="Özel .m3u8 linki yapıştır...">
        <button onclick="playCustom()">Oynat</button>
      </div>
    </div>
  </div>

  <script>
    let currentHls = null;
    const video = document.getElementById('videoPlayer');

    function playStreamUrl(streamUrl, channelName) {
      document.title = (channelName || 'Canlı Maç') + ' - SporX';
      if (Hls.isSupported()) {
        if (currentHls) currentHls.destroy();
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(()=>{}));
        currentHls = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.play().catch(()=>{});
      }
    }

    async function selectChannel(id, name) {
      document.querySelectorAll('.channel-card').forEach(el => el.classList.remove('active'));
      const activeEl = document.getElementById('ch_' + id);
      if (activeEl) activeEl.classList.add('active');

      const res = await fetch('/api/stream-url?id=' + encodeURIComponent(id));
      const data = await res.json();
      if (data.url) playStreamUrl(data.url, name);
    }

    function playCustom() {
      const url = document.getElementById('customM3u8Input').value.trim();
      if (url) playStreamUrl(url, 'Özel Yayın');
    }

    async function loadChannels() {
      try {
        const res = await fetch('/api/channels');
        const data = await res.json();
        const list = document.getElementById('channelList');
        list.innerHTML = '';

        data.channels.forEach(ch => {
          const card = document.createElement('div');
          card.className = 'channel-card';
          card.id = 'ch_' + ch.id;
          card.onclick = () => selectChannel(ch.id, ch.name);
          card.innerHTML = '<div class="channel-title">' + ch.icon + ' ' + ch.name + '</div><div class="channel-cat">' + ch.category + '</div>';
          list.appendChild(card);
        });

        // Auto-play default direct stream (test3 or first channel)
        selectChannel('test3', 'Canlı Maç Yayını');
      } catch (e) {
        console.error(e);
      }
    }

    loadChannels();
  </script>
</body>
</html>`;
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

module.exports = StreamProxy;
