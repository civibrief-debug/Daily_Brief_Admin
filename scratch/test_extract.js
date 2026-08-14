async function testExtract() {
  const tweetUrl = "https://x.com/paaiinnnn/status/2088139573348221250";
  const match = tweetUrl.match(/(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/i);
  if (match) {
    const user = match[1];
    const id = match[2];
    try {
      const res = await fetch(`https://api.fxtwitter.com/${user}/status/${id}`);
      const json = await res.json();
      console.log("fxtwitter result:", JSON.stringify(json.tweet?.media, null, 2));
      if (json.tweet?.media?.photos?.[0]?.url) {
        console.log("Extracted photo:", json.tweet.media.photos[0].url);
      }
    } catch (e) {
      console.error("Error fxtwitter:", e);
    }
  }
}

testExtract();
