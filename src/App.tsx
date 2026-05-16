import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { Sidebar } from "@/src/components/Sidebar";
import { LandingPage } from "@/src/pages/LandingPage";
import { HomePage } from "@/src/pages/HomePage";
import { MessengerPage } from "@/src/pages/MessengerPage";
import { AnimatePresence, motion } from "motion/react";
import { Globe, User as UserIcon, LogOut, Bell } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gcn-blue">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-gcn-cyan rounded-2xl cyan-glow flex items-center justify-center"
        >
          <Globe className="text-gcn-blue w-8 h-8" />
        </motion.div>
        <p className="mt-6 text-gcn-cyan font-display font-medium tracking-[0.2em] uppercase text-xs animate-pulse">Initializing Network...</p>
      </div>
    );
  }

  if (!user && location.pathname !== "/") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gcn-blue flex overflow-hidden">
      {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
      
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        user ? "ml-20 lg:ml-24" : "w-full"
      )}>
        {user && (
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-white/5 backdrop-blur-xl z-50 sticky top-0">
             <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-white/90 uppercase font-display">
                Connectivity <span className="text-gcn-cyan">Network</span>
              </h1>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden sm:block">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search the global ecosystem..." 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-gcn-cyan/50 transition-all text-white" 
                />
                <div className="absolute left-3 top-2.5 opacity-50">
                  <Globe className="w-4 h-4 text-gcn-cyan" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-mono text-gcn-cyan">
                <div className="w-2 h-2 bg-gcn-cyan rounded-full animate-pulse shadow-[0_0_8px_#00F2FE]"></div>
                4.2M ACTIVE
              </div>
              
              <div className="flex items-center gap-3">
                 <button className="p-2 text-white/40 hover:text-white transition-all">
                    <Bell className="w-5 h-5" />
                 </button>
                 <div className="w-10 h-10 rounded-full border-2 border-gcn-cyan p-0.5 group relative cursor-pointer" onClick={() => auth.signOut()}>
                    <img src={user.photoURL || "/avatar.png"} className="w-full h-full rounded-full object-cover" alt="profile" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold">OUT</div>
                 </div>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/messages" element={<MessengerPage />} />
              <Route path="/discover" element={<div className="text-white p-10 glass rounded-3xl m-8">Discover Page Under Construction</div>} />
              <Route path="/market" element={<div className="text-white p-10 glass rounded-3xl m-8">Marketplace Integration Coming Soon</div>} />
              <Route path="/profile" element={<div className="text-white p-10 glass rounded-3xl m-8">User Profile Detail Page</div>} />
              <Route path="/settings" element={<div className="text-white p-10 glass rounded-3xl m-8">System Settings</div>} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
