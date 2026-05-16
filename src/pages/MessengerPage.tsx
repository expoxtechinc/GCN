import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Search, Phone, Video, Info, Sparkles, X, MessageSquare, Bot, Plus } from "lucide-react";
import { GlassCard } from "@/src/components/GlassCard";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, where, or } from "firebase/firestore";
import type { Message } from "@/src/types";
import { cn } from "@/src/lib/utils";

export function MessengerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<any>(null);
  const [isAiMode, setIsAiMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // In a real app, we'd query by conversation ID
    // For this prototype, we'll just show a "Global Group Chat" or "AI Assistant"
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(data);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "messages");
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || !auth.currentUser) return;

    const messageText = newMessage;
    setNewMessage("");

    try {
      await addDoc(collection(db, "messages"), {
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        senderPhoto: auth.currentUser.photoURL,
        text: messageText,
        createdAt: serverTimestamp(),
      });

      if (isAiMode) {
        // Trigger AI response
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: messageText })
        });
        const data = await res.json();
        
        await addDoc(collection(db, "messages"), {
          senderId: "ai-bot",
          senderName: "GCN-AI",
          senderPhoto: "",
          text: data.text,
          isAi: true,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "messages");
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 pb-4">
      {/* Chats Sidebar */}
      <GlassCard className="w-80 flex flex-col p-4" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">Direct</h2>
          <div className="p-2 bg-gcn-cyan/10 rounded-lg text-gcn-cyan">
             <MessageSquare className="w-5 h-5" />
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search connections..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gcn-cyan/30"
          />
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <button 
            onClick={() => setIsAiMode(true)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
              isAiMode ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-white/5"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 flex items-center justify-center cyan-glow">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-white font-bold truncate">GCN-AI Assistant</p>
              <p className="text-purple-400 text-xs">Active Intelligence</p>
            </div>
          </button>

          {[1,2,3].map(i => (
            <button 
              key={i} 
              onClick={() => setIsAiMode(false)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden">
                <img src={`https://picsum.photos/seed/${i+10}/100`} alt="user" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">Connection {i}</p>
                <p className="text-slate-500 text-xs truncate">Last message active...</p>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main Chat Area */}
      <GlassCard className="flex-1 flex flex-col p-0" hover={false}>
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={cn(
               "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center overflow-hidden",
               isAiMode && "bg-purple-500"
             )}>
                {isAiMode ? <Bot className="text-white w-5 h-5" /> : <User className="text-white w-5 h-5" />}
             </div>
             <div>
                <h3 className="text-white font-bold">{isAiMode ? "GCN-AI Assistant" : "Global Network Chat"}</h3>
                <p className="text-gcn-cyan text-[10px] uppercase tracking-widest font-bold">Encrypted Node</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"><Info className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === auth.currentUser?.uid;
            return (
              <motion.div 
                key={msg.id || idx}
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("flex", isMe ? "justify-end" : "justify-start")}
              >
                <div className={cn(
                  "max-w-[70%] p-3 rounded-2xl text-sm",
                  isMe 
                    ? "bg-gcn-cyan text-gcn-blue font-medium rounded-tr-none" 
                    : msg.senderId === 'ai-bot'
                      ? "bg-purple-900 border border-purple-500/30 text-white rounded-tl-none"
                      : "glass text-slate-200 rounded-tl-none"
                )}>
                  {msg.text}
                  <div className={cn("text-[9px] mt-1 opacity-60", isMe ? "text-gcn-blue" : "text-slate-400")}>
                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 pl-4 items-center">
            <button className="text-slate-500 hover:text-gcn-cyan transition-colors"><Plus className="w-5 h-5" /></button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isAiMode ? "Ask GCN-AI anything..." : "Write a secure message..."}
              className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
            />
            <button 
              onClick={() => setIsAiMode(!isAiMode)}
              className={cn(
                "p-2 rounded-xl transition-all",
                isAiMode ? "text-purple-400 bg-purple-400/10" : "text-slate-500 hover:text-white"
              )}
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-gcn-cyan hover:bg-cyan-400 disabled:opacity-50 text-gcn-blue p-2.5 rounded-xl transition-all cyan-glow"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
