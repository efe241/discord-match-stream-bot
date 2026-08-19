const CHANNELS = [
  // ==========================================
  // 🏆 beIN SPORTS KANALLARI (Süper Lig & Avrupa)
  // ==========================================
  {
    id: 'bein1',
    name: 'beIN SPORTS 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/209141.ts',
    aliases: ['bein1', 'bein-1', 'bein 1', 'bein', 'beinsports', 'beinsports1', 'bein sports 1', 'mac'],
    category: 'beIN SPORTS / Süper Lig',
    icon: '🏆'
  },
  {
    id: 'bein2',
    name: 'beIN SPORTS 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/143131.ts',
    aliases: ['bein2', 'bein-2', 'bein 2', 'beinsports2', 'bein sports 2'],
    category: 'beIN SPORTS / Süper Lig',
    icon: '🏆'
  },
  {
    id: 'bein3',
    name: 'beIN SPORTS 3 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/19218.ts',
    aliases: ['bein3', 'bein-3', 'bein 3', 'beinsports3', 'bein sports 3'],
    category: 'beIN SPORTS / Süper Lig',
    icon: '🏆'
  },
  {
    id: 'bein4',
    name: 'beIN SPORTS 4 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/24606.ts',
    aliases: ['bein4', 'bein-4', 'bein 4', 'beinsports4', 'bein sports 4'],
    category: 'beIN SPORTS / Süper Lig',
    icon: '🏆'
  },
  {
    id: 'bein5',
    name: 'beIN SPORTS 5 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/3461.ts',
    aliases: ['bein5', 'bein-5', 'bein 5', 'beinsports5', 'bein sports 5'],
    category: 'beIN SPORTS / Süper Lig',
    icon: '🏆'
  },
  {
    id: 'beinmax1',
    name: 'beIN SPORTS MAX 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/10065.ts',
    aliases: ['beinmax1', 'max1', 'bein-max1', 'bein max 1'],
    category: 'beIN SPORTS / MAX',
    icon: '🏆'
  },
  {
    id: 'beinmax2',
    name: 'beIN SPORTS MAX 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/158878.ts',
    aliases: ['beinmax2', 'max2', 'bein-max2', 'bein max 2'],
    category: 'beIN SPORTS / MAX',
    icon: '🏆'
  },

  // ==========================================
  // ⚽ EXXEN SPOR KANALLARI (Şampiyonlar Ligi & Konferans Ligi)
  // ==========================================
  {
    id: 'exxenspor1',
    name: 'Exxen Sport 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/143915.ts',
    aliases: ['exxenspor1', 'exxen1', 'exxenspor', 'exxen-spor1', 'exxen spor 1'],
    category: 'Exxen Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'exxenspor2',
    name: 'Exxen Sport 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/114070.ts',
    aliases: ['exxenspor2', 'exxen2', 'exxen-spor2', 'exxen spor 2'],
    category: 'Exxen Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'exxenspor3',
    name: 'Exxen Sport 3 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/122853.ts',
    aliases: ['exxenspor3', 'exxen3', 'exxen-spor3', 'exxen spor 3'],
    category: 'Exxen Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'exxenspor4',
    name: 'Exxen Sport 4 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/133406.ts',
    aliases: ['exxenspor4', 'exxen4', 'exxen-spor4', 'exxen spor 4'],
    category: 'Exxen Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'exxenspor5',
    name: 'Exxen Sport 5 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/99140.ts',
    aliases: ['exxenspor5', 'exxen5', 'exxen-spor5', 'exxen spor 5'],
    category: 'Exxen Spor / UEFA',
    icon: '⚽'
  },

  // ==========================================
  // ⚽ S SPORT & S SPORT PLUS (Premier League, La Liga, Serie A)
  // ==========================================
  {
    id: 'ssport1',
    name: 'S Sport 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/71749.ts',
    aliases: ['ssport1', 'ssport', 's-sport', 's-sport1', 's sport 1', 'ssport 1'],
    category: 'S Sport / Premier League',
    icon: '⚽'
  },
  {
    id: 'ssport2',
    name: 'S Sport 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/197161.ts',
    aliases: ['ssport2', 's-sport2', 's sport 2', 'ssport 2'],
    category: 'S Sport / Serie A & EuroLeague',
    icon: '⚽'
  },
  {
    id: 'ssportplus1',
    name: 'S Sport Plus 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/193970.ts',
    aliases: ['ssportplus1', 'ssportplus', 'ssport-plus1', 's sport plus 1'],
    category: 'S Sport Plus',
    icon: '⚽'
  },
  {
    id: 'ssportplus2',
    name: 'S Sport Plus 2 HD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/197160.ts',
    aliases: ['ssportplus2', 'ssport-plus2', 's sport plus 2'],
    category: 'S Sport Plus',
    icon: '⚽'
  },

  // ==========================================
  // ⚽ TABİİ SPOR & TRT (UEFA & Milli Maçlar)
  // ==========================================
  {
    id: 'tabiispor1',
    name: 'Tabii Spor 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/81051.ts',
    aliases: ['tabiispor1', 'tabiispor', 'tabii-spor', 'tabii spor', 'tabii1', 'tabii-1'],
    category: 'Tabii Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'tabiispor2',
    name: 'Tabii Spor 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/156472.ts',
    aliases: ['tabiispor2', 'tabii-spor2', 'tabiispor 2', 'tabii2', 'tabii-2'],
    category: 'Tabii Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'tabiispor3',
    name: 'Tabii Spor 3 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/95166.ts',
    aliases: ['tabiispor3', 'tabii-spor3', 'tabiispor 3', 'tabii3', 'tabii-3'],
    category: 'Tabii Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'tabiispor4',
    name: 'Tabii Spor 4 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/56469.ts',
    aliases: ['tabiispor4', 'tabii-spor4', 'tabiispor 4', 'tabii4', 'tabii-4'],
    category: 'Tabii Spor / UEFA',
    icon: '⚽'
  },
  {
    id: 'trt1',
    name: 'TRT 1 (Tabii HD)',
    directUrl: 'https://tv-trt1.medya.trt.com.tr/master_720.m3u8',
    tabiiUrl: 'https://www.tabii.com/tr/watch/live/trt1?trackId=150002',
    aliases: ['trt1', 'trt-1', 'trt 1', 'tabii'],
    category: 'TRT / Ulusal',
    icon: '📺'
  },
  {
    id: 'trtspor',
    name: 'TRT Spor HD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/154561.ts',
    aliases: ['trtspor', 'trt-spor', 'trt spor', 'spor'],
    category: 'TRT / Spor',
    icon: '⚽'
  },

  // ==========================================
  // ⚽ TİVİBU SPOR & EUROSPORT & A SPOR
  // ==========================================
  {
    id: 'tivibu1',
    name: 'Tivibu Spor 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/90373.ts',
    aliases: ['tivibu1', 'tivibu', 'tivibuspor', 'tivibu-spor1', 'tivibu spor 1'],
    category: 'Tivibu Spor',
    icon: '⚽'
  },
  {
    id: 'tivibu2',
    name: 'Tivibu Spor 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/44717.ts',
    aliases: ['tivibu2', 'tivibu-spor2', 'tivibu spor 2'],
    category: 'Tivibu Spor',
    icon: '⚽'
  },
  {
    id: 'tivibu3',
    name: 'Tivibu Spor 3 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/37476.ts',
    aliases: ['tivibu3', 'tivibu-spor3', 'tivibu spor 3'],
    category: 'Tivibu Spor',
    icon: '⚽'
  },
  {
    id: 'eurosport1',
    name: 'Eurosport 1 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/145527.ts',
    aliases: ['eurosport1', 'eurosport', 'euro-sport1', 'eurosport 1'],
    category: 'Eurosport',
    icon: '🎾'
  },
  {
    id: 'eurosport2',
    name: 'Eurosport 2 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/39047.ts',
    aliases: ['eurosport2', 'euro-sport2', 'eurosport 2'],
    category: 'Eurosport',
    icon: '🎾'
  },
  {
    id: 'aspor',
    name: 'A Spor FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/82931.ts',
    aliases: ['aspor', 'a-spor', 'a spor'],
    category: 'A Spor / Kupa Maçları',
    icon: '⚽'
  },
  {
    id: 'tv85',
    name: 'TV 8.5 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/98024.ts',
    aliases: ['tv85', 'tv8.5', 'tv8-5', 'tv 8.5', 'tv 85'],
    category: 'TV 8.5 / Maç & Özet',
    icon: '⚽'
  },

  // ==========================================
  // 🎬 EXXEN SHOW & ULUSAL TV KANALLARI
  // ==========================================
  {
    id: 'exxen',
    name: 'Exxen TV 1',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/103232.ts',
    aliases: ['exxen', 'exxentv', 'exxen-tv', 'exxen tv'],
    category: 'Exxen / Şov',
    icon: '🎬'
  },
  {
    id: 'atv',
    name: 'ATV FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/36980.ts',
    aliases: ['atv', 'atv hd', 'atvfhd'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'showtv',
    name: 'Show TV FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/35060.ts',
    aliases: ['showtv', 'show', 'show-tv', 'show tv'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'kanald',
    name: 'Kanal D FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/72368.ts',
    aliases: ['kanald', 'kanal-d', 'kanal d'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'startv',
    name: 'Star TV FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/107672.ts',
    aliases: ['startv', 'star', 'star-tv', 'star tv'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'now',
    name: 'NOW TV FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/107148.ts',
    aliases: ['now', 'nowtv', 'fox', 'foxtv', 'now tv'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'tv8',
    name: 'TV 8 FHD',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/259.ts',
    aliases: ['tv8', 'tv-8', 'tv 8'],
    category: 'Ulusal',
    icon: '📺'
  }
];

function findChannel(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase().replace(/^!/, '');
  
  // Check exact ID or alias match
  const found = CHANNELS.find(ch => 
    ch.id.toLowerCase() === q || 
    ch.aliases?.some(a => a.toLowerCase() === q) ||
    ch.name.toLowerCase() === q
  );

  if (found) return found;

  // Fuzzy match
  return CHANNELS.find(ch => 
    ch.name.toLowerCase().includes(q) || 
    ch.id.toLowerCase().includes(q)
  );
}

module.exports = {
  CHANNELS,
  findChannel
};
