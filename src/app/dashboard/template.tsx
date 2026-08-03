"use client";

import { motion } from "framer-motion";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.99 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
