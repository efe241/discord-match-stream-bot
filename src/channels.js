const CHANNELS = [
  // --- Canlı Maç & Spor Kanalları ---
  {
    id: 'bein1',
    name: 'beIN SPORTS 1 HD',
    code: 'tr',
    directUrl: 'http://92.113.151.217/test3/index.m3u8',
    aliases: ['bein1', 'bein-1', 'bein 1', 'bein', 'beinsports', 'beinsports1', 'bein sports 1', 'test3', 'mac'],
    category: 'Süper Lig / Canlı Maç',
    icon: '🏆'
  },
  {
    id: 'trt1',
    name: 'TRT 1 (Tabii)',
    code: 'tr',
    directUrl: 'https://tv-trt1.medya.trt.com.tr/master_720.m3u8',
    tabiiUrl: 'https://www.tabii.com/tr/watch/live/trt1?trackId=150002',
    aliases: ['trt1', 'trt-1', 'trt 1', 'tabii', 'tabii trt1', 'tabii-trt1'],
    category: 'Ulusal / Maç & Spor (Tabii)',
    icon: '📺'
  },
  {
    id: 'tabiispor',
    name: 'Tabii Spor 1 FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/222071.m3u8',
    aliases: ['tabiispor', 'tabii-spor', 'tabiispor1', 'tabii spor', 'tabiispor 1'],
    category: 'Avrupa Maçları / UEFA',
    icon: '⚽'
  },
  {
    id: 'ssport1',
    name: 'S Sport 1 FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/71749.m3u8',
    aliases: ['ssport1', 'ssport', 's-sport', 's-sport1', 's sport 1', 'ssport 1'],
    category: 'Spor / Premier League / La Liga',
    icon: '⚽'
  },
  {
    id: 'ssport2',
    name: 'S Sport 2 FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/197161.m3u8',
    aliases: ['ssport2', 's-sport2', 's sport 2', 'ssport 2'],
    category: 'Spor / Serie A / EuroLeague',
    icon: '⚽'
  },
  {
    id: 'tv85',
    name: 'TV 8.5 FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/98024.m3u8',
    aliases: ['tv85', 'tv8.5', 'tv8-5', 'tv 8.5', 'tv 85'],
    category: 'Spor & Maç / Canlı Yayın',
    icon: '⚽'
  },
  {
    id: 'exxen',
    name: 'Exxen TV 1',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/103232.m3u8',
    aliases: ['exxen', 'exxentv', 'exxen1', 'exxen-tv', 'exxen tv'],
    category: 'Dizi / Show / Eğlence',
    icon: '🎬'
  },
  {
    id: 'trtspor',
    name: 'TRT Spor',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/154561.m3u8',
    aliases: ['trtspor', 'trt-spor', 'trt spor', 'spor'],
    category: 'Spor',
    icon: '⚽'
  },
  {
    id: 'aspor',
    name: 'A Spor FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/82931.m3u8',
    aliases: ['aspor', 'a-spor', 'a spor'],
    category: 'Spor / Ziraat Türkiye Kupası',
    icon: '⚽'
  },

  // --- Ulusal & Popüler TV Kanalları ---
  {
    id: 'atv',
    name: 'ATV FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/36980.m3u8',
    aliases: ['atv', 'atv hd', 'atvfhd'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'showtv',
    name: 'Show TV FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/35060.m3u8',
    aliases: ['showtv', 'show', 'show-tv', 'show tv'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'kanald',
    name: 'Kanal D FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/72368.m3u8',
    aliases: ['kanald', 'kanal-d', 'kanal d'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'startv',
    name: 'Star TV FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/107672.m3u8',
    aliases: ['startv', 'star', 'star-tv', 'star tv'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'now',
    name: 'NOW TV FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/107148.m3u8',
    aliases: ['now', 'nowtv', 'fox', 'foxtv', 'now tv'],
    category: 'Ulusal',
    icon: '📺'
  },
  {
    id: 'tv8',
    name: 'TV 8 FHD',
    code: 'tr',
    directUrl: 'http://richtv323.xyz:2095/live/dnzmstf6700tv2/mss3012cc00bb/259.m3u8',
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
