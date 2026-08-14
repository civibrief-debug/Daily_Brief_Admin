async function testVarious() {
  const urls = [
    "https://x.com/paaiinnnn/status/2088139573348221250?s=20",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://unsplash.com/photos/a-computer-screen-with-a-bunch-of-lines-on-it-01SzghDAuqE"
  ];

  for (const u of urls) {
    console.log("--- Testing URL:", u);
    // Twitter/X
    const twMatch = u.match(/(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i);
    if (twMatch) {
      const user = twMatch[1];
      const id = twMatch[2];
      const res = await fetch(`https://api.fxtwitter.com/${user}/status/${id}`);
      const json = await res.json();
      console.log("Twitter extracted:", json.tweet?.media?.photos?.[0]?.url, "Text:", json.tweet?.text);
      continue;
    }

    // YouTube
    const ytMatch = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch) {
      console.log("YouTube extracted:", `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`);
      continue;
    }

    // Generic Webpage
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'Twitterbot/1.0 (compatible; Googlebot/2.1)' } });
      const html = await res.text();
      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
      console.log("Generic extracted:", ogMatch ? ogMatch[1] : 'None');
    } catch (e) {
      console.error("Fetch err:", e);
    }
  }
}

testVarious();
