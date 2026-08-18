function base64Decode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64').toString('utf-8');
}

/**
 * Resolves the raw .m3u8 stream URL from player page
 * @param {string} channelName
 * @param {string} countryCode
 * @param {string} customUrl
 */
async function resolveStreamUrl(channelName, countryCode = 'tr', customUrl = null) {
  const playerUrl = customUrl || `https://cdnlivetv.tv/api/v1/channels/player/?name=${encodeURIComponent(channelName)}&code=${countryCode}&user=cdnlivetv&plan=free`;
  
  const res = await fetch(playerUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://sporx.rf.gd/'
    }
  });

  if (!res.ok) {
    throw new Error(`Player page responded with status ${res.status}`);
  }

  const html = await res.text();

  // Pattern: funcName(var1) + funcName(var2) ...
  const funcMatch = html.match(/function\s+([A-Za-z0-9_]+)\(s\)\{s=s\.replace[\s\S]*?var\s+([A-Za-z0-9_]+)=([\s\S]*?);\s*var _p2pMode/);
  
  if (!funcMatch) {
    // Check if source directly points to a URL
    const directMatch = html.match(/source\s*:\s*\{\s*src\s*:\s*['"](https?:\/\/[^'"]+\.m3u8[^'"]*)['"]/i);
    if (directMatch) {
      return directMatch[1];
    }
    throw new Error('Canlı yayın bağlantısı sayfadan çözümlenemedi.');
  }

  const funcName = funcMatch[1];
  const assignmentsBlock = funcMatch[3];

  const varMap = {};
  const varRegex = /var\s+([A-Za-z0-9_]+)\s*=\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = varRegex.exec(html)) !== null) {
    varMap[match[1]] = match[2];
  }

  const callRegex = new RegExp(`${funcName}\\(([A-Za-z0-9_]+)\\)`, 'g');
  let streamUrl = '';
  while ((match = callRegex.exec(assignmentsBlock)) !== null) {
    const vName = match[1];
    if (varMap[vName]) {
      streamUrl += base64Decode(varMap[vName]);
    }
  }

  if (!streamUrl || !streamUrl.startsWith('http')) {
    throw new Error('Çözümlenen yayın linki geçersiz.');
  }

  return streamUrl;
}

/**
 * Fetch list of current live matches
 */
async function fetchLiveMatches() {
  try {
    const soccerUrl = 'https://api.cdnlivetv.tv/api/v1/events/sports/soccer/?user=cdnlivetv&plan=free';
    const res = await fetch(soccerUrl);
    if (!res.ok) return [];

    const data = await res.json();
    const mainData = data["cdnlivetv.tv"];
    if (!mainData) return [];

    const matches = [];
    for (const key in mainData) {
      if (key.startsWith("total_")) continue;
      if (Array.isArray(mainData[key])) {
        mainData[key].forEach(ev => {
          if (Array.isArray(ev.channels) && ev.channels.length > 0) {
            const firstCh = ev.channels[0];
            if (firstCh && firstCh.url) {
              const name = ev.homeTeam && ev.awayTeam ? `${ev.homeTeam} vs ${ev.awayTeam}` : (firstCh.channel_name || ev.name);
              matches.push({
                name,
                tournament: ev.tournament || 'Futbol',
                time: ev.time || ev.start || 'Canlı',
                status: ev.status,
                url: firstCh.url,
                channelName: firstCh.channel_name || 'Spor'
              });
            }
          }
        });
      }
    }
    return matches;
  } catch (err) {
    console.error('Error fetching live matches:', err.message);
    return [];
  }
}

module.exports = {
  resolveStreamUrl,
  fetchLiveMatches
};
