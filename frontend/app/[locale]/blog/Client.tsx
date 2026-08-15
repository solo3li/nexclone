import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";

export default async function BlogIndex() {
  let posts = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const res = await fetch(`${apiUrl}/api/blog`, { cache: 'no-store' });
    if (res.ok) {
      posts = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch posts", err);
  }

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-32">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">Latest Updates</h1>
        
        {posts.length === 0 ? (
          <p className="text-center text-white/50 py-12">No posts available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link href={`/blog/${post.id}` as any} key={post.id} className="block group">
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/50 transition-colors h-full flex flex-col">
                  {post.mediaUrl ? (
                    post.mediaType === 'video' ? (
                      <video src={post.mediaUrl} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <img src={post.mediaUrl} alt={post.title} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )
                  ) : (
                    <div className="w-full h-48 bg-violet-500/10 flex items-center justify-center">
                      <span className="text-violet-500/50 text-4xl">📝</span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>💬 {post.commentCount} Comments</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">{post.title}</h2>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4 flex-1">
                      {post.contentSummary.replace(/<[^>]*>?/gm, '')}
                    </p>
                    <span className="text-violet-400 font-semibold text-sm">Read More →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
