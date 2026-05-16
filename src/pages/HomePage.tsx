import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Image as ImageIcon, Send, Sparkles, MoreHorizontal, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { GlassCard } from "@/src/components/GlassCard";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import type { Post } from "@/src/types";
import { cn } from "@/src/lib/utils";

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "posts");
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "posts"), {
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous User",
        authorPhoto: auth.currentUser.photoURL || "",
        content: newPost,
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewPost("");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "posts");
    }
  };

  const handleAiRefinement = async () => {
    if (!newPost.trim()) return;
    setIsAiSuggesting(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Refine this social media post to be more engaging and futuristic, but keep the original intent: "${newPost}"` })
      });
      const data = await res.json();
      setNewPost(data.text || newPost);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-0 h-full">
      {/* Left Column: Discovery */}
      <div className="hidden xl:block col-span-3 border-r border-white/10 p-6 bg-black/10 overflow-y-auto no-scrollbar">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Trending Communities</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            <div className="text-sm font-semibold">Future Tech Lab</div>
            <div className="text-xs text-white/40 mt-1">12.4k Members • 142 Active</div>
          </div>
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            <div className="text-sm font-semibold">Mars Colonization Hub</div>
            <div className="text-xs text-white/40 mt-1">8.9k Members • 89 Active</div>
          </div>
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
            <div className="text-sm font-semibold">Quantum Devs</div>
            <div className="text-xs text-white/40 mt-1">25k Members • 412 Active</div>
          </div>
        </div>

        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mt-12 mb-6">AI Assistants Online</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 font-mono text-[10px]">A1</div>
            <span className="text-sm font-medium">Aura Core v2.4</span>
            <span className="ml-auto text-[10px] text-green-400">STABLE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gcn-cyan/20 border border-gcn-cyan/50 flex items-center justify-center text-gcn-cyan font-mono text-[10px]">G7</div>
            <span className="text-sm font-medium">Genesis Vision</span>
            <span className="ml-auto text-[10px] text-green-400">STABLE</span>
          </div>
        </div>
      </div>

      {/* Middle Column: Feed */}
      <div className="col-span-12 xl:col-span-6 p-6 overflow-y-auto no-scrollbar space-y-8">
        {/* Create Post */}
        <GlassCard className="p-4 rounded-3xl" hover={false}>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden shrink-0">
              <img src={auth.currentUser?.photoURL || "https://picsum.photos/seed/user/200"} alt="User" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in your corner of the network?"
                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 resize-none py-2 text-lg"
                rows={3}
              />
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-gcn-cyan hover:bg-white/5 rounded-lg transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleAiRefinement}
                    disabled={!newPost.trim() || isAiSuggesting}
                    className={cn(
                      "p-2 rounded-lg transition-all flex items-center gap-2",
                      isAiSuggesting ? "animate-pulse text-gcn-cyan" : "text-slate-400 hover:text-purple-400 hover:bg-purple-400/10"
                    )}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-medium hidden sm:block">AI Refine</span>
                  </button>
                </div>
                <button
                  disabled={!newPost.trim()}
                  onClick={handlePost}
                  className="bg-gcn-cyan hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-gcn-cyan text-gcn-blue px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  Post <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stories/Trending Row */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="shrink-0 w-24 h-36 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group cursor-pointer">
              <img src={`https://picsum.photos/seed/story${i}/400/600`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="w-8 h-8 rounded-full border-2 border-gcn-cyan overflow-hidden mb-1">
                  <img src={`https://picsum.photos/seed/avatar${i}/100`} alt="user" referrerPolicy="no-referrer" />
                </div>
                <p className="text-[10px] text-white font-medium truncate">User {i}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feed */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-6">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Right Column: AI & Market */}
      <div className="hidden xl:flex col-span-3 border-l border-white/10 p-6 flex-col gap-6 bg-black/5 overflow-y-auto no-scrollbar">
        <div className="bg-gradient-to-br from-[#00F2FE]/20 to-purple-500/20 border border-white/20 rounded-3xl p-5 shadow-[0_0_30px_rgba(0,242,254,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gcn-cyan tracking-widest uppercase">AI Assistant: Aura</h3>
            <div className="w-2 h-2 bg-gcn-cyan rounded-full shadow-[0_0_10px_#00F2FE]"></div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 mb-4">
            <p className="text-xs text-white/70 italic leading-relaxed">
              "I've analyzed your network growth. You have 3 new professional connections in Silicon Valley tech sectors."
            </p>
          </div>
          <button className="w-full py-2 bg-gcn-cyan text-gcn-blue font-bold text-xs rounded-lg shadow-lg hover:bg-cyan-400 transition-colors">
            OPEN CONSOLE
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-4">Market Snapshot</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80">Neural-Link V4</div>
              <div className="text-xs font-mono text-green-400">$1,240.00</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80">GCN Premium (1y)</div>
              <div className="text-xs font-mono text-green-400">$49.99</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80">Custom AI Avatar</div>
              <div className="text-xs font-mono text-green-400">$12.50</div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 border border-white/10 text-white/80 font-bold text-xs rounded-lg hover:bg-white/5 transition-colors">
            VIEW MARKETPLACE
          </button>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-[10px] text-white/20 uppercase font-bold tracking-widest border-t border-white/5 pt-4">
            <span>Liberia Hub</span>
            <span>Node: GCN-AF-01</span>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gcn-cyan text-gcn-blue px-6 py-2 rounded-full font-bold text-xs shadow-[0_0_20px_#00F2FE] flex items-center gap-3 z-50 animate-bounce">
        <Sparkles className="w-4 h-4" />
        NEW BROADCAST: GCN Mainnet Upgrade Complete
      </div>
    </div>
  );
}

function PostItem({ post }: { post: Post; key?: string }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full border border-white/10 overflow-hidden">
              <img src={post.authorPhoto || "https://picsum.photos/seed/user/200"} alt={post.authorName} referrerPolicy="no-referrer" />
            </div>
            <div>
              <h4 className="text-white font-bold leading-tight hover:text-gcn-cyan cursor-pointer transition-colors">
                {post.authorName}
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                {post.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • GCN-NET
              </p>
            </div>
          </div>
          <button className="text-slate-500 hover:text-white p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-200 leading-relaxed mb-6 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.media && post.media.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-6 border border-white/5">
             <img src={post.media[0].url} className="w-full h-auto" alt="post media" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "flex items-center gap-2 transition-colors",
                isLiked ? "text-pink-500" : "text-slate-400 hover:text-pink-500"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              <span className="text-xs font-bold">{post.likesCount + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-gcn-cyan transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-bold">{post.commentsCount}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-bold">Share</span>
            </button>
          </div>
          <button className="text-slate-400 hover:text-amber-400 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
