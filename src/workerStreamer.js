const { Client } = require('discord.js-selfbot-v13');
const { Streamer, prepareStream, playStream, Encoders } = require('@dank074/discord-video-stream');

class WorkerStreamer {
  constructor(name, token, options = {}) {
    this.name = name;
    this.token = token;
    this.client = new Client({
      checkUpdate: false,
      readyStatus: false,
      syncStatus: false,
      patchVoice: true,
      ws: {
        properties: {
          os: 'Windows',
          browser: 'Discord Client',
          release_channel: 'stable',
          client_version: '1.0.9175',
          os_version: '10.0.19045',
          os_arch: 'x64',
          system_locale: 'tr-TR'
        }
      }
    });
    this.streamer = new Streamer(this.client);
    this.activeStreamAbortController = null;
    this.activeChannelName = null;
    this.activeVoiceChannel = null;
    this.streamController = null;
    this.isReady = false;

    this.quality = {
      width: parseInt(process.env.STREAM_WIDTH || '1280', 10),
      height: parseInt(process.env.STREAM_HEIGHT || '720', 10),
      frameRate: parseInt(process.env.STREAM_FPS || '30', 10),
      bitrateVideo: parseInt(process.env.STREAM_BITRATE || '1800', 10),
      bitrateAudio: parseInt(process.env.STREAM_AUDIO_BITRATE || '96', 10)
    };
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        this.isReady = true;
        console.log(`[🟢 Worker Hazır] ${this.name} -> Hesap: ${this.client.user.tag} (ID: ${this.client.user.id})`);
        resolve(this.client.user);
      });

      this.client.login(this.token).catch(err => {
        console.error(`[❌ Worker Giriş Hatası] (${this.name}):`, err.message);
        reject(err);
      });
    });
  }

  async stopCurrentStream() {
    if (this.activeStreamAbortController) {
      try {
        this.activeStreamAbortController.abort();
      } catch (e) {}
      this.activeStreamAbortController = null;
    }
    try {
      await Promise.race([
        this.streamer.stopStream(),
        new Promise(r => setTimeout(r, 600))
      ]);
    } catch (e) {}
    this.activeChannelName = null;
    this.streamController = null;
  }

  async leaveVoice() {
    await this.stopCurrentStream();
    try {
      this.streamer.leaveVoice();
    } catch (e) {}
    this.activeVoiceChannel = null;
  }

  async startStreaming(voiceChannel, streamSourceUrl, title, streamType = 'camera') {
    await this.stopCurrentStream();

    // Humanized jitter delay to prevent instant bot-like triggers
    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 400) + 300));

    console.log(`[🔴 Worker Yayını Başlatılıyor] [${this.name} (${this.client.user.tag})] -> Kanal: ${title} | Ses Odası: ${voiceChannel.name}`);

    // Join Voice Channel
    try {
      if (!this.streamer.voiceConnection || this.streamer.voiceConnection.channelId !== voiceChannel.id) {
        await this.streamer.joinVoice(voiceChannel.guild.id, voiceChannel.id);
      }
    } catch (e) {
      console.error(`[Worker ${this.name} Ses Bağlantı Hatası]:`, e.message);
    }

    this.activeStreamAbortController = new AbortController();
    this.activeChannelName = title;
    this.activeVoiceChannel = voiceChannel;

    const streamOpts = {
      width: this.quality.width,
      height: this.quality.height,
      frameRate: this.quality.frameRate,
      bitrateVideo: this.quality.bitrateVideo,
      bitrateAudio: this.quality.bitrateAudio,
      includeAudio: true,
      minimizeLatency: true,
      encoder: Encoders.software({
        x264: {
          preset: 'ultrafast',
          tune: 'zerolatency'
        }
      }),
      customInputOptions: [
        '-allowed_extensions', 'ALL',
        '-reconnect', '1',
        '-reconnect_at_eof', '1',
        '-reconnect_streamed', '1',
        '-reconnect_delay_max', '2'
      ],
      customFfmpegFlags: [
        '-r', `${this.quality.frameRate}`,
        '-g', `${this.quality.frameRate}`,
        '-keyint_min', `${this.quality.frameRate}`,
        '-sc_threshold', '0',
        '-bf', '0',
        '-maxrate', `${this.quality.bitrateVideo}k`,
        '-bufsize', `${this.quality.bitrateVideo * 2}k`,
        '-pix_fmt', 'yuv420p'
      ]
    };

    // Continuous resilient live loop
    (async () => {
      while (this.activeChannelName) {
        try {
          const prep = prepareStream(streamSourceUrl, streamOpts, this.activeStreamAbortController?.signal);
          this.streamController = prep.controller;

          await playStream(prep.output, this.streamer, {
            type: streamType,
            width: this.quality.width,
            height: this.quality.height,
            frameRate: this.quality.frameRate
          }, this.activeStreamAbortController?.signal);
        } catch (err) {
          if (!this.activeChannelName) break;
          console.log(`[${this.name}] Canlı akış tazeleniyor...`);
          await new Promise(r => setTimeout(r, 600));
        }
      }
      console.log(`[${this.name}] Yayın Sona Erdi: ${title}`);
    })();
  }
}

module.exports = WorkerStreamer;
