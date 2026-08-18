const CHANNELS = [
  {
    id: 'test3',
    name: 'Canlı Maç Yayını (Direkt)',
    directUrl: 'http://92.113.151.217/test3/index.m3u8',
    aliases: ['test3', 'test', 'mac', 'canlimac', 'direkt'],
    category: 'Canlı Maç',
    icon: '🔥'
  },
  {
    id: 'trt1',
    name: 'TRT 1 (Tabii)',
    code: 'tr',
    directUrl: 'https://tv-trt1.medya.trt.com.tr/master_720.m3u8',
    tabiiUrl: 'https://www.tabii.com/tr/watch/live/trt1?trackId=150002',
    aliases: ['trt1', 'trt-1', 'trt 1', 'tabii', 'tabii trt1', 'tabii-trt1', 'https://www.tabii.com/tr/watch/live/trt1?trackId=150002'],
    category: 'Ulusal / Maç & Spor (Tabii)',
    icon: '📺'
  },
  {
    id: 'trt2',
    name: 'TRT 2',
    code: 'tr',
    aliases: ['trt2', 'trt-2', 'trt 2'],
    category: 'Kültür / Sanat',
    icon: '📺'
  },
  {
    id: 'trt3',
    name: 'TRT 3',
    code: 'tr',
    aliases: ['trt3', 'trt-3', 'trt 3'],
    category: 'Genel',
    icon: '📺'
  },
  {
    id: 'trtspor',
    name: 'TRT Spor',
    code: 'tr',
    aliases: ['trtspor', 'trt-spor', 'trt spor', 'spor'],
    category: 'Spor',
    icon: '⚽'
  },
  {
    id: 'bein1',
    name: 'beIN SPORTS 1 HD',
    code: 'tr',
    directUrl: 'http://92.113.151.217/test3/index.m3u8',
    aliases: ['bein1', 'bein-1', 'bein 1', 'bein', 'beinsports', 'beinsports1', 'bein sports 1', 'test3'],
    category: 'Süper Lig / Canlı Maç',
    icon: '🏆'
  },
  {
    id: 'bein2',
    name: 'beIN SPORTS 2',
    code: 'tr',
    aliases: ['bein2', 'bein-2', 'bein 2', 'beinsports2', 'bein sports 2'],
    category: 'Spor',
    icon: '🏆'
  },
  {
    id: 'bein3',
    name: 'beIN SPORTS 3',
    code: 'tr',
    aliases: ['bein3', 'bein-3', 'bein 3', 'beinsports3', 'bein sports 3'],
    category: 'Spor',
    icon: '🏆'
  },
  {
    id: 'bein4',
    name: 'beIN SPORTS 4',
    code: 'tr',
    aliases: ['bein4', 'bein-4', 'bein 4', 'beinsports4', 'bein sports 4'],
    category: 'Spor',
    icon: '🏆'
  },
  {
    id: 'beinhd1',
    name: 'beIN SPORTS HD 1',
    code: 'tr',
    aliases: ['beinhd1', 'bein-hd1', 'bein hd 1'],
    category: 'Spor',
    icon: '🏆'
  }
];

function findChannel(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  
  // Check exact ID or alias match
  const found = CHANNELS.find(ch => 
    ch.id === q || 
    ch.aliases?.some(a => a.toLowerCase() === q) ||
    ch.name.toLowerCase() === q
  );

  if (found) return found;

  // Fuzzy match
  return CHANNELS.find(ch => 
    ch.name.toLowerCase().includes(q) || 
    ch.aliases?.some(a => a.toLowerCase().includes(q))
  ) || null;
}

module.exports = {
  CHANNELS,
  findChannel
};
