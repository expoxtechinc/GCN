import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Globe, ArrowRight, Shield, Zap, MessageCircle, ShoppingCart } from "lucide-react";
import { GlassCard } from "@/src/components/GlassCard";
import { signInWithGoogle } from "@/src/lib/firebase";

export function LandingPage() {
  const handleStart = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        window.location.href = "/home";
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-gcn-cyan/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"
        />
      </div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Globe className="text-gcn-cyan w-8 h-8" />
          <span className="font-display font-bold text-2xl tracking-tighter text-white">GCN</span>
        </div>
        <button
          onClick={handleStart}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-full font-medium transition-all"
        >
          Login
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gcn-cyan/10 text-gcn-cyan text-sm font-medium border border-gcn-cyan/20 mb-8 uppercase tracking-widest">
              The Next Evolution of Connection
            </span>
            <h1 className="text-6xl lg:text-8xl font-display font-bold leading-[0.9] text-white mb-8 tracking-tighter">
              Global Connectivity.<br />
              <span className="text-gradient">AI Powered.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Experience the world's most advanced social ecosystem. Seamless messaging, immersive streaming, global trade, and intelligent AI interaction—all in one futuristic platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStart}
                className="bg-gcn-cyan hover:bg-cyan-400 text-gcn-blue px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all cyan-glow"
              >
                Join the Network <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/about"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureItem
            icon={Zap}
            title="Futuristic Speed"
            desc="Built on a next-gen scalable architecture for millions of users."
          />
          <FeatureItem
            icon={Shield}
            title="Encrypted & Secure"
            desc="End-to-end encryption for all messages and private data."
          />
          <FeatureItem
            icon={MessageCircle}
            title="AI Intelligence"
            desc="Gemini-powered moderation and personal assistant integration."
          />
          <FeatureItem
            icon={ShoppingCart}
            title="Global Trade"
            desc="Full-featured marketplace with secure payment gateways."
          />
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Globe className="text-gcn-cyan w-6 h-6" />
            <span className="font-display font-bold text-xl text-white">GCN</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Global Connectivity Network. From Liberia to the World.</p>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-gcn-cyan transition-colors">Privacy</a>
            <a href="#" className="hover:text-gcn-cyan transition-colors">Terms</a>
            <a href="#" className="hover:text-gcn-cyan transition-colors">Network Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <GlassCard className="group hover:border-gcn-cyan/30">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gcn-cyan/10 group-hover:cyan-glow transition-all">
        <Icon className="text-gcn-cyan w-6 h-6" />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </GlassCard>
  );
}
