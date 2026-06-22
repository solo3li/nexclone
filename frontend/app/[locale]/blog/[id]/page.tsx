"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { use, useEffect, useState } from "react";
import api from "@/utils/api";
import { useAppStore } from "@/store/useAppStore";

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: params is a Promise, must be unwrapped with React.use()
  const { id } = use(params);

  const [post, setPost] = useState<any>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    if (!id) return;
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/api/blog/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      await api.post(`/api/blog/${id}/comments`, { content: commentContent });
      setCommentContent("");
      await fetchPost();
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-32">
        <article className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-12">
          {post.mediaUrl && (
            post.mediaType === "video" ? (
              <video src={post.mediaUrl} controls className="w-full max-h-[500px] bg-black" />
            ) : (
              <img src={post.mediaUrl} alt={post.title} className="w-full max-h-[500px] object-cover" />
            )
          )}
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 text-sm text-white/40 mb-6">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">{post.title}</h1>
            <div
              className="prose prose-invert prose-violet max-w-none prose-img:rounded-xl prose-a:text-violet-400"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-white mb-8">
            Comments ({post.comments?.length || 0})
          </h3>

          <div className="space-y-6 mb-10">
            {post.comments?.map((comment: any) => (
              <div
                key={comment.id}
                className={`p-6 rounded-2xl ${
                  comment.isAdminReply
                    ? "bg-violet-500/10 border border-violet-500/30 ml-8"
                    : "bg-white/5 border border-white/5"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`font-semibold ${
                      comment.isAdminReply ? "text-violet-400" : "text-white/80"
                    }`}
                  >
                    {comment.author} {comment.isAdminReply && "👑"}
                  </span>
                  <span className="text-xs text-white/40">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/70 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
            {post.comments?.length === 0 && (
              <p className="text-white/40 text-center py-4">Be the first to comment!</p>
            )}
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="flex flex-col gap-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none h-32"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentContent.trim()}
                className="self-end px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/60 mb-4">Please log in to leave a comment.</p>
              <button
                onClick={() =>
                  document.getElementById("auth-modal")?.classList.remove("hidden")
                }
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Log In
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
