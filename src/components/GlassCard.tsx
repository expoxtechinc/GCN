import React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.005, translateY: -1 } : {}}
      className={cn(
        "glass rounded-3xl p-6 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
