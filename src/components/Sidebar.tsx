import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Globe, User, Bell, LayoutDashboard, ShoppingBag } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Globe, label: "Discover", path: "/discover" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: ShoppingBag, label: "Market", path: "/market" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 lg:w-24 bg-black/20 border-r border-white/10 flex flex-col items-center py-8 z-40 gap-8"
    >
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="w-12 h-12 bg-linear-to-br from-[#00F2FE] to-[#4FACFE] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,172,254,0.5)]">
          <span className="text-2xl font-black italic tracking-tighter text-gcn-blue">G</span>
        </div>
      </div>

      <nav className="flex-1 w-full flex flex-col items-center space-y-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-4 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-gcn-cyan/10 text-gcn-cyan shadow-[inset_0_0_10px_rgba(0,242,254,0.2)]" 
                  : "text-white/40 hover:text-white/80"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "cyan-glow")} />
              {isActive && (
                <motion.div 
                  layoutId="active-dot" 
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gcn-cyan rounded-l-full cyan-glow" 
                />
              )}
              {/* Tooltip for small sidebar */}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-gcn-cyan text-gcn-blue text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity translate-x-3 group-hover:translate-x-0 hidden lg:block z-50">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="w-full flex justify-center pb-4">
        <Link to="/settings" className="p-4 rounded-2xl text-white/40 hover:text-white/80 transition-colors bg-white/5 border border-white/5">
          <LayoutDashboard className="w-6 h-6" />
        </Link>
      </div>
    </motion.aside>
  );
}
