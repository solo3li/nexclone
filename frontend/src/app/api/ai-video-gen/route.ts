import { NextResponse } from 'next/server';

interface VideoSection {
  keyword: string;
  duration: number;
  text?: string;
  text_y?: number;
  filter?: string;
  bg_color?: string;
}

interface ProductionPlan {
  title: string;
  color_grade: string;
  bg_color: string;
  mood: string;
  music_genre: string;
  sections: VideoSection[];
  title_card?: { text: string; duration: number; color: string };
  outro?: { text: string; duration: number };
}

// ─── Curated Free Music Library (Internet Archive & other CC0 sources) ────
const MUSIC_LIBRARY: Record<string, { url: string; name: string }[]> = {
  cinematic: [
    { url: 'https://archive.org/download/cinematic-piano-background/cinematic-piano-background.mp3', name: 'Cinematic Piano' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name: 'Cinematic Ambient' },
  ],
  upbeat: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', name: 'Upbeat Track' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', name: 'Bright Energy' },
  ],
  calm: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', name: 'Calm Ambient' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', name: 'Peaceful Tones' },
  ],
  epic: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', name: 'Epic Build' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', name: 'Dramatic Rise' },
  ],
  romantic: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name: 'Romantic Theme' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', name: 'Gentle Melody' },
  ],
  nature: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', name: 'Nature Ambient' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', name: 'Organic Flow' },
  ],
  default: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', name: 'Background Music' },
  ],
};

function pickMusic(genre: string): { url: string; name: string } {
  const key = Object.keys(MUSIC_LIBRARY).find(k => genre.toLowerCase().includes(k)) || 'default';
  const tracks = MUSIC_LIBRARY[key];
  return tracks[Math.floor(Math.random() * tracks.length)];
}

// ─── Pexels ───────────────────────────────────────────────────────────────
async function fetchPexelsVideo(keyword: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape&size=medium`,
      { headers: { Authorization: apiKey } }
    );
    const data = await res.json();
    if (data.videos?.length > 0) {
      const hdFile = (data.videos[0].video_files as any[])
        .filter((f: any) => f.quality === 'hd' || f.quality === 'sd')
        .sort((a: any, b: any) => b.width - a.width)[0];
      return hdFile?.link || null;
    }
  } catch (e) { console.error('Pexels error:', e); }
  return null;
}

// ─── Pixabay ──────────────────────────────────────────────────────────────
async function fetchPixabayVideo(keyword: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(keyword)}&video_type=film&per_page=3`
    );
    const data = await res.json();
    if (data.hits?.length > 0) {
      return data.hits[0].videos?.medium?.url || data.hits[0].videos?.small?.url || null;
    }
  } catch (e) { console.error('Pixabay error:', e); }
  return null;
}

// ─── Wikimedia Commons (no key) ───────────────────────────────────────────
async function fetchWikimediaMedia(keyword: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&prop=imageinfo&iiprop=url|mime&format=json&origin=*&gsrlimit=5`
    );
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {}) as any[];
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      const mime = info?.mime || '';
      if (mime.startsWith('video/')) return info.url;
      if (mime.startsWith('image/') && !mime.includes('svg') && !mime.includes('tiff')) return info.url;
    }
  } catch (e) { console.error('Wikimedia error:', e); }
  return null;
}

// ─── Picsum fallback (no key) ─────────────────────────────────────────────
function getPicsumUrl(keyword: string, index: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(keyword + index)}/1920/1080`;
}

// ─── Gradient fallback ────────────────────────────────────────────────────
function generateGradientBackground(keyword: string): string {
  const palette: Record<string, [string, string]> = {
    nature: ['#1a472a', '#2d6a4f'], ocean: ['#0077b6', '#00b4d8'],
    city: ['#2b2d42', '#8d99ae'], sunset: ['#e76f51', '#f4a261'],
    space: ['#03045e', '#0077b6'], forest: ['#1b4332', '#40916c'],
    desert: ['#c9a227', '#e07b39'], winter: ['#caf0f8', '#90e0ef'],
    default: ['#1a1a2e', '#16213e'],
  };
  const key = Object.keys(palette).find(k => keyword.toLowerCase().includes(k)) || 'default';
  const [c1, c2] = palette[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c1}"/><stop offset="100%" style="stop-color:${c2}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    // Step 1: AI Production Plan
    const planRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional AI video director. Create a production plan in JSON.
Return ONLY valid JSON (no markdown) with this structure:
{
  "title": "Video title",
  "color_grade": "CSS filter like 'saturate(1.4) contrast(1.1)'",
  "bg_color": "#hexcolor",
  "mood": "cinematic|upbeat|calm|epic|romantic|nature",
  "music_genre": "describe the music mood/genre",
  "sections": [
    {
      "keyword": "2-3 word English search term",
      "duration": 8,
      "text": "Short cinematic overlay text",
      "text_y": 80,
      "filter": "optional CSS filter",
      "bg_color": "#hexcolor"
    }
  ],
  "title_card": { "text": "Main Title", "duration": 4, "color": "#ffffff" },
  "outro": { "text": "Closing message", "duration": 3 }
}
Rules: 3-5 sections, total 25-45 seconds, simple English keywords for stock video search.`
          },
          { role: 'user', content: `Create a video about: ${prompt}` }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const planData = await planRes.json();
    if (!planData.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: 'AI failed to generate plan' }, { status: 500 });
    }

    const plan: ProductionPlan = JSON.parse(planData.choices[0].message.content);

    // Step 2: Fetch media from ALL available sources in parallel
    const pexelsKey = process.env.PEXELS_API_KEY || '';
    const pixabayKey = process.env.PIXABAY_API_KEY || '';

    const mediaUrls: string[] = [];
    const mediaTypes: ('video' | 'image')[] = [];

    for (let i = 0; i < plan.sections.length; i++) {
      const { keyword } = plan.sections[i];
      let url: string | null = null;
      let type: 'video' | 'image' = 'image';

      // Try sources in priority order
      if (pexelsKey) {
        url = await fetchPexelsVideo(keyword, pexelsKey);
        if (url) type = 'video';
      }
      if (!url && pixabayKey) {
        url = await fetchPixabayVideo(keyword, pixabayKey);
        if (url) type = 'video';
      }
      if (!url) {
        const wikiUrl = await fetchWikimediaMedia(keyword);
        if (wikiUrl) { url = wikiUrl; type = wikiUrl.match(/\.(mp4|webm|ogv)/i) ? 'video' : 'image'; }
      }
      // Picsum fallback for images
      if (!url) {
        url = getPicsumUrl(keyword, i);
        type = 'image';
      }

      mediaUrls.push(url!);
      mediaTypes.push(type);
    }

    // Step 3: Pick background music
    const music = pickMusic(plan.mood || plan.music_genre || 'default');

    return NextResponse.json({
      plan,
      mediaUrls,
      mediaTypes,
      music,
      sources: {
        hasPexels: !!pexelsKey,
        hasPixabay: !!pixabayKey,
        hasWikimedia: true,
        hasPicsum: true,
      }
    });

  } catch (error) {
    console.error('AI Video Gen Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
