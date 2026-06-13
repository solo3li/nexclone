import { NextResponse } from 'next/server';

// Production plan returned by AI
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
  sections: VideoSection[];
  title_card?: { text: string; duration: number; color: string };
  outro?: { text: string; duration: number };
}

async function fetchPexelsVideo(keyword: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape&size=medium`,
      { headers: { Authorization: apiKey }, next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.videos && data.videos.length > 0) {
      const video = data.videos[0];
      const hdFile = (video.video_files as any[])
        .filter((f: any) => f.quality === 'hd' || f.quality === 'sd')
        .sort((a: any, b: any) => b.width - a.width)[0];
      return hdFile?.link || null;
    }
  } catch (e) {
    console.error('Pexels fetch error:', e);
  }
  return null;
}

async function fetchPixabayVideo(keyword: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(keyword)}&video_type=film&per_page=3`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      const video = data.hits[0];
      return video.videos?.medium?.url || video.videos?.small?.url || null;
    }
  } catch (e) {
    console.error('Pixabay fetch error:', e);
  }
  return null;
}

// Generate a gradient SVG as data URL when no video API key is available
function generateColorBackground(color: string, keyword: string): string {
  const colors: Record<string, [string, string]> = {
    nature: ['#1a472a', '#2d6a4f'],
    ocean: ['#0077b6', '#00b4d8'],
    city: ['#2b2d42', '#8d99ae'],
    sunset: ['#e76f51', '#f4a261'],
    space: ['#03045e', '#0077b6'],
    forest: ['#1b4332', '#40916c'],
    default: ['#1a1a2e', '#16213e'],
  };
  const key = Object.keys(colors).find(k => keyword.toLowerCase().includes(k)) || 'default';
  const [c1, c2] = colors[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c1}"/><stop offset="100%" style="stop-color:${c2}"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><text x="960" y="540" font-family="sans-serif" font-size="48" fill="rgba(255,255,255,0.15)" text-anchor="middle" dominant-baseline="middle">${keyword}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    // Step 1: Get production plan from AI
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
            content: `You are an AI video director. Create a video production plan as JSON.
Return ONLY valid JSON with this exact structure (no markdown):
{
  "title": "Short video title",
  "color_grade": "CSS filter string like 'saturate(1.4) contrast(1.1) brightness(0.95)'",
  "bg_color": "#hex fallback color",
  "sections": [
    {
      "keyword": "2-3 word Pexels search term",
      "duration": 8,
      "text": "optional overlay text (keep short)",
      "text_y": 85,
      "filter": "optional extra CSS filter",
      "bg_color": "#hex color for this section"
    }
  ],
  "title_card": { "text": "Main Title", "duration": 4, "color": "#ffffff" },
  "outro": { "text": "Closing message", "duration": 3 }
}
Rules:
- 3 to 5 sections
- total duration should be 20-40 seconds
- keywords should be simple English for Pexels stock video search
- color_grade should match the video mood
- text should be short, cinematic phrases`
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

    // Step 2: Fetch video URLs
    const pexelsKey = process.env.PEXELS_API_KEY || '';
    const pixabayKey = process.env.PIXABAY_API_KEY || '';

    const videoUrls: (string | null)[] = [];
    for (const section of plan.sections) {
      let url: string | null = null;
      if (pexelsKey) {
        url = await fetchPexelsVideo(section.keyword, pexelsKey);
      } else if (pixabayKey) {
        url = await fetchPixabayVideo(section.keyword, pixabayKey);
      }
      // Fallback to gradient background
      if (!url) {
        url = generateColorBackground(section.bg_color || plan.bg_color || '#1a1a2e', section.keyword);
      }
      videoUrls.push(url);
    }

    return NextResponse.json({
      plan,
      videoUrls,
      hasPexels: !!pexelsKey,
      hasPixabay: !!pixabayKey,
    });

  } catch (error) {
    console.error('AI Video Gen Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
