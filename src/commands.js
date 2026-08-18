const { SlashCommandBuilder } = require('discord.js');
const { CHANNELS } = require('./channels');

const channelChoices = CHANNELS.map(ch => ({
  name: `${ch.icon} ${ch.name} (${ch.category})`,
  value: ch.id
}));

const slashCommands = [
  new SlashCommandBuilder()
    .setName('yayin')
    .setDescription('Belirtilen TV/Spor kanalını ses kanalında canlı ekran yayını olarak açar.')
    .addStringOption(option =>
      option.setName('kanal')
        .setDescription('İzlemek istediğiniz kanal')
        .setRequired(true)
        .addChoices(...channelChoices)
    ),

  new SlashCommandBuilder()
    .setName('yayin_link')
    .setDescription('Doğrudan bir .m3u8 veya yayın URL bağlantısını ses kanalında canlı yayınlar.')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Yayın .m3u8 veya web bağlantısı (Örn: http://92.113.151.217/test3/index.m3u8)')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('kanallar')
    .setDescription('İzlenebilir tüm canlı spor ve TV kanallarının listesini gösterir.'),

  new SlashCommandBuilder()
    .setName('maclar')
    .setDescription('Sitedeki o an canlı olan futbol maçlarını listeler.'),

  new SlashCommandBuilder()
    .setName('durdur')
    .setDescription('Aktif yayını durdurur ve ses kanalından ayrılır.'),

  new SlashCommandBuilder()
    .setName('ses')
    .setDescription('Yayın ses seviyesini ayarlar.')
    .addIntegerOption(option =>
      option.setName('seviye')
        .setDescription('Ses düzeyi (0 - 200 arası)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(200)
    ),

  new SlashCommandBuilder()
    .setName('kalite')
    .setDescription('Yayın çözünürlüğünü değiştirir.')
    .addStringOption(option =>
      option.setName('cozunurluk')
        .setDescription('Hedef çözünürlük')
        .setRequired(true)
        .addChoices(
          { name: '720p HD (1280x720)', value: '720' },
          { name: '1080p Full HD (1920x1080)', value: '1080' }
        )
    ),

  new SlashCommandBuilder()
    .setName('fps')
    .setDescription('Yayın kare hızını (FPS) ayarlar.')
    .addIntegerOption(option =>
      option.setName('kare_hizi')
        .setDescription('Kare hızı seçin')
        .setRequired(true)
        .addChoices(
          { name: '30 FPS (Standart)', value: 30 },
          { name: '60 FPS (Ultra Akıcı)', value: 60 }
        )
    ),

  new SlashCommandBuilder()
    .setName('durum')
    .setDescription('Aktif yayın ve performans durumunu gösterir.'),

  new SlashCommandBuilder()
    .setName('yardim')
    .setDescription('Botun kullanım kılavuzunu ve tüm komutlarını gösterir.')
];

module.exports = {
  slashCommands
};
