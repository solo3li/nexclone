import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const pexelsKey = process.env.PEXELS_API_KEY;
  const pixabayKey = process.env.PIXABAY_API_KEY;

  if (pexelsKey) {
    try {
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=9&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      );
      const data = await res.json();
      const results = (data.videos || []).map((v: any) => {
        const hdFile = (v.video_files as any[])
          .filter((f: any) => f.quality === 'hd' || f.quality === 'sd')
          .sort((a: any, b: any) => b.width - a.width)[0];
        return {
          url: hdFile?.link || '',
          thumb: v.image || '',
          name: v.url?.split('/').filter(Boolean).pop() || q,
        };
      }).filter((r: any) => r.url);
      return NextResponse.json({ results, source: 'pexels' });
    } catch (e) {
      console.error('Pexels search error:', e);
    }
  }

  if (pixabayKey) {
    try {
      const res = await fetch(
        `https://pixabay.com/api/videos/?key=${pixabayKey}&q=${encodeURIComponent(q)}&per_page=9&video_type=film`
      );
      const data = await res.json();
      const results = (data.hits || []).map((v: any) => ({
        url: v.videos?.medium?.url || v.videos?.small?.url || '',
        thumb: v.picture_id ? `https://i.vimeocdn.com/video/${v.picture_id}_295x166.jpg` : '',
        name: v.tags?.split(',')[0]?.trim() || q,
      })).filter((r: any) => r.url);
      return NextResponse.json({ results, source: 'pixabay' });
    } catch (e) {
      console.error('Pixabay search error:', e);
    }
  }

  // No API keys — return message
  return NextResponse.json({
    results: [],
    message: 'Add PEXELS_API_KEY or PIXABAY_API_KEY to .env for stock video search'
  });
}
