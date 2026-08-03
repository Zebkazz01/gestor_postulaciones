"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Briefcase,
  CheckCircle,
  Clock,
  ChatTeardropText,
  Trophy,
  ArrowUpRight,
  Sparkle,
} from "@phosphor-icons/react";

export function Hero3DMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });

  // Floating elements parallax shifts
  const floatX1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), {
    stiffness: 100,
    damping: 15,
  });
  const floatY1 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-25, 25]), {
    stiffness: 100,
    damping: 15,
  });

  const floatX2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [30, -30]), {
    stiffness: 120,
    damping: 18,
  });
  const floatY2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [30, -30]), {
    stiffness: 120,
    damping: 18,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto mt-12 w-full max-w-5xl px-4 perspective-[1200px]"
    >
      {/* 3D Main Dashboard Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative rounded-2xl border border-white/20 bg-background/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-card/90"
      >
        {/* Glow light reflection */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-60 pointer-events-none" />

        {/* Mockup Header */}
        <div className="relative mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-3 w-3 rounded-full bg-red-500/80" />
            <div className="flex h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="flex h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              app.postulaya.com/dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 rounded-full bg-muted" />
            <div className="h-7 w-7 rounded-full bg-primary/20" />
          </div>
        </div>

        {/* Mockup Stats Grid */}
        <div className="relative mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
            <div className="flex items-center gap-2 text-yellow-500">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-semibold">Pendientes</span>
            </div>
            <p className="mt-1 text-xl font-bold">4</p>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
            <div className="flex items-center gap-2 text-blue-500">
              <ChatTeardropText className="h-4 w-4" />
              <span className="text-xs font-semibold">Entrevistas</span>
            </div>
            <p className="mt-1 text-xl font-bold">2</p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-semibold">Ofertas</span>
            </div>
            <p className="mt-1 text-xl font-bold">1</p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3">
            <div className="flex items-center gap-2 text-purple-500">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-semibold">Total</span>
            </div>
            <p className="mt-1 text-xl font-bold">12</p>
          </div>
        </div>

        {/* Mockup Job List */}
        <div className="relative space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 font-bold text-sm">
                G
              </div>
              <div>
                <p className="text-sm font-bold">Google</p>
                <p className="text-xs text-muted-foreground">Senior Frontend Engineer</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
              Oferta
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 font-bold text-sm">
                S
              </div>
              <div>
                <p className="text-sm font-bold">Stripe</p>
                <p className="text-xs text-muted-foreground">Fullstack Developer</p>
              </div>
            </div>
            <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-xs font-medium text-blue-500">
              Entrevista
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 font-bold text-sm">
                V
              </div>
              <div>
                <p className="text-sm font-bold">Vercel</p>
                <p className="text-xs text-muted-foreground">React Infrastructure Lead</p>
              </div>
            </div>
            <span className="rounded-full bg-yellow-500/15 border border-yellow-500/30 px-2.5 py-0.5 text-xs font-medium text-yellow-500">
              Pendiente
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating 3D Badge 1: Oferta Aceptada */}
      <motion.div
        style={{
          x: floatX1,
          y: floatY1,
          translateZ: 50,
        }}
        initial={{ opacity: 0, scale: 0.8, x: -30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute -left-4 top-12 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-background/90 p-3.5 shadow-2xl backdrop-blur-md dark:bg-card/95"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
          <Trophy className="h-5 w-5" weight="fill" />
        </div>
        <div>
          <p className="text-xs font-semibold text-emerald-500">Nueva Oferta Recibida</p>
          <p className="text-sm font-bold">$95,000 USD / Año · Remote</p>
        </div>
      </motion.div>

      {/* Floating 3D Badge 2: Entrevista Agendada */}
      <motion.div
        style={{
          x: floatX2,
          y: floatY2,
          translateZ: 60,
        }}
        initial={{ opacity: 0, scale: 0.8, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute -right-4 bottom-10 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-background/90 p-3.5 shadow-2xl backdrop-blur-md dark:bg-card/95"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
          <Sparkle className="h-5 w-5" weight="fill" />
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-500">Entrevista Técnica</p>
          <p className="text-sm font-bold">Mañana a las 10:00 AM</p>
        </div>
      </motion.div>
    </div>
  );
}
