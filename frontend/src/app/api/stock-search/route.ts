import { NextResponse } from 'next/server';

interface MediaResult {
  url: string;
  thumb: string;
  name: string;
  type: 'video' | 'image';
  source: string;
}

// ─── Pexels ────────────────────────────────────────────────────────────────
async function searchPexels(q: string, apiKey: string): Promise<MediaResult[]> {
  const results: MediaResult[] = [];
  try {
    // Videos
    const vRes = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=6&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    const vData = await vRes.json();
    for (const v of (vData.videos || []).slice(0, 4)) {
      const file = (v.video_files as any[])
        .filter((f: any) => f.quality === 'hd' || f.quality === 'sd')
        .sort((a: any, b: any) => b.width - a.width)[0];
      if (file?.link) results.push({ url: file.link, thumb: v.image, name: v.url?.split('/').filter(Boolean).pop() || q, type: 'video', source: 'Pexels' });
    }
    // Images
    const iRes = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    const iData = await iRes.json();
    for (const p of (iData.photos || []).slice(0, 3)) {
      results.push({ url: p.src?.original || p.src?.large2x || '', thumb: p.src?.small || '', name: p.alt || q, type: 'image', source: 'Pexels' });
    }
  } catch (e) { console.error('Pexels error:', e); }
  return results.filter(r => r.url);
}

// ─── Pixabay ───────────────────────────────────────────────────────────────
async function searchPixabay(q: string, apiKey: string): Promise<MediaResult[]> {
  const results: MediaResult[] = [];
  try {
    // Videos
    const vRes = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(q)}&per_page=6&video_type=film`
    );
    const vData = await vRes.json();
    for (const v of (vData.hits || []).slice(0, 4)) {
      const url = v.videos?.medium?.url || v.videos?.small?.url || '';
      const thumb = v.picture_id ? `https://i.vimeocdn.com/video/${v.picture_id}_295x166.jpg` : '';
      if (url) results.push({ url, thumb, name: v.tags?.split(',')[0]?.trim() || q, type: 'video', source: 'Pixabay' });
    }
    // Images
    const iRes = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(q)}&per_page=6&image_type=photo&orientation=horizontal`
    );
    const iData = await iRes.json();
    for (const img of (iData.hits || []).slice(0, 3)) {
      results.push({ url: img.largeImageURL || img.webformatURL, thumb: img.previewURL, name: img.tags?.split(',')[0]?.trim() || q, type: 'image', source: 'Pixabay' });
    }
  } catch (e) { console.error('Pixabay error:', e); }
  return results.filter(r => r.url);
}

// ─── Wikimedia Commons (No API Key) ───────────────────────────────────────
async function searchWikimedia(q: string): Promise<MediaResult[]> {
  const results: MediaResult[] = [];
  try {
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&prop=imageinfo&iiprop=url|mime|mediatype|thumburl&iiurlwidth=320&format=json&origin=*&gsrlimit=10`
    );
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {}) as any[];
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      const mime = info.mime || '';
      const url = info.url || '';
      const thumb = info.thumburl || '';
      if (!url) continue;
      if (mime.startsWith('image/') && !mime.includes('svg') && !mime.includes('tiff')) {
        results.push({ url, thumb, name: page.title?.replace('File:', '').split('.')[0] || q, type: 'image', source: 'Wikimedia' });
      } else if (mime.startsWith('video/')) {
        results.push({ url, thumb, name: page.title?.replace('File:', '').split('.')[0] || q, type: 'video', source: 'Wikimedia' });
      }
    }
  } catch (e) { console.error('Wikimedia error:', e); }
  return results.slice(0, 6);
}

// ─── Picsum Photos (No API Key) ────────────────────────────────────────────
function getPicsumResults(q: string, count = 4): MediaResult[] {
  return Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/seed/${encodeURIComponent(q + i)}/1920/1080`,
    thumb: `https://picsum.photos/seed/${encodeURIComponent(q + i)}/320/180`,
    name: `${q} photo ${i + 1}`,
    type: 'image' as const,
    source: 'Picsum',
  }));
}

// ─── Route Handler ─────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all'; // 'video', 'image', 'all'

  if (!q.trim()) return NextResponse.json({ results: [] });

  const pexelsKey = process.env.PEXELS_API_KEY || '';
  const pixabayKey = process.env.PIXABAY_API_KEY || '';

  // Run all searches in parallel
  const [pexelsResults, pixabayResults, wikimediaResults] = await Promise.allSettled([
    pexelsKey ? searchPexels(q, pexelsKey) : Promise.resolve([] as MediaResult[]),
    pixabayKey ? searchPixabay(q, pixabayKey) : Promise.resolve([] as MediaResult[]),
    searchWikimedia(q),
  ]);

  let results: MediaResult[] = [
    ...(pexelsResults.status === 'fulfilled' ? pexelsResults.value : []),
    ...(pixabayResults.status === 'fulfilled' ? pixabayResults.value : []),
    ...(wikimediaResults.status === 'fulfilled' ? wikimediaResults.value : []),
  ];

  // Supplement with Picsum if no images found
  const hasImages = results.some(r => r.type === 'image');
  if (!hasImages || results.length < 4) {
    results = [...results, ...getPicsumResults(q, 4)];
  }

  // Filter by type if requested
  if (filter === 'video') results = results.filter(r => r.type === 'video');
  else if (filter === 'image') results = results.filter(r => r.type === 'image');

  // Deduplicate by URL
  const seen = new Set<string>();
  results = results.filter(r => { if (seen.has(r.url)) return false; seen.add(r.url); return true; });

  return NextResponse.json({
    results: results.slice(0, 18),
    sources: [...new Set(results.map(r => r.source))],
  });
}
