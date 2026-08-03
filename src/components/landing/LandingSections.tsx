"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  ChartBar,
  ShieldCheck,
  Lightning,
  Sparkle,
  CheckCircle,
  CaretDown,
  User,
  Star,
  DeviceMobile,
  FolderOpen,
} from "@phosphor-icons/react";

// --- Stats Bar Section ---
export function StatsSection() {
  const stats = [
    { label: "Postulaciones gestionadas", value: "+10,000", icon: Briefcase, color: "text-blue-500" },
    { label: "Tiempo ahorrado promedio", value: "85%", icon: Lightning, color: "text-yellow-500" },
    { label: "Disponibilidad garantizada", value: "99.9%", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Costo de uso", value: "$0 USD", icon: Sparkle, color: "text-purple-500" },
  ];

  return (
    <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center p-4 rounded-xl border border-border/30 bg-background/50 hover:border-primary/40 transition-colors">
                <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" weight="bold" />
                </div>
                <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Live Interactive Demo Tabs Section ---
export function InteractiveDemoSection() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "features" | "mobile">("dashboard");

  return (
    <section className="py-24 border-t border-border/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Vista previa interactiva
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
              Una experiencia diseñada para tu tranquilidad
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              Prueba cómo luce la interfaz en tiempo real y cómo simplifica tu búsqueda activa.
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Controls */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl border border-border/50 bg-muted/40 p-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "dashboard"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ChartBar className="h-4 w-4" /> Dashboard Inteligente
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "features"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FolderOpen className="h-4 w-4" /> Gestión por Estados
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "mobile"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <DeviceMobile className="h-4 w-4" /> Multi-dispositivo
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Tab Content Display */}
        <ScrollReveal delay={0.2}>
          <div className="relative min-h-[350px] rounded-2xl border border-border/50 bg-card p-6 shadow-xl">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg">Métricas y Pipeline en tiempo real</h3>
                  <p className="text-sm text-muted-foreground">
                    Obtén claridad inmediata de cuántas postulaciones están pendientes, en entrevista o con oferta recibida.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-blue-500 font-semibold">Entrevistas Activas</p>
                      <p className="text-2xl font-bold mt-1">3 Agendadas</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs text-emerald-500 font-semibold">Ofertas Recibidas</p>
                      <p className="text-2xl font-bold mt-1">2 Propuestas</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs text-purple-500 font-semibold">Tasa de Respuesta</p>
                      <p className="text-2xl font-bold mt-1">68% Positiva</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg">Cambio de estado interactivo con un clic</h3>
                  <p className="text-sm text-muted-foreground">
                    Haz clic sobre cualquier estado para actualizarlo al instante con notificaciones de color.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-500 font-semibold text-xs">
                      Pendiente
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-500 font-semibold text-xs">
                      Entrevista
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-500 font-semibold text-xs">
                      Prueba Técnica
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 font-semibold text-xs">
                      Oferta
                    </span>
                  </div>
                </motion.div>
              )}

              {activeTab === "mobile" && (
                <motion.div
                  key="mobile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg">Optimizado para móviles y escritorio</h3>
                  <p className="text-sm text-muted-foreground">
                    Accede desde tu teléfono mientras estás fuera o desde tu computadora con vistas de tarjetas y tablas adaptables.
                  </p>
                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 text-xs text-muted-foreground">
                    Funciona en iOS, Android, macOS y Windows sin necesidad de instalar nada.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// --- How It Works 3D Step Section ---
export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Crea tu cuenta gratis",
      desc: "Regístrate en segundos con tu correo electrónico. Sin tarjetas de crédito ni complicaciones.",
    },
    {
      num: "02",
      title: "Registra tus postulaciones",
      desc: "Añade la empresa, cargo, enlace de la oferta y tus apuntes personales sobre el proceso.",
    },
    {
      num: "03",
      title: "Gestiona tu pipeline",
      desc: "Actualiza el estado según avances en entrevistas o pruebas técnicas hasta conseguir la oferta.",
    },
  ];

  return (
    <section className="py-24 border-t border-border/50 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ¿Cómo funciona PostulaYa?
            </h2>
            <p className="text-muted-foreground mt-2">
              Tres sencillos pasos para tomar el control de tu carrera.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <Card className="relative border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="text-4xl font-black text-primary/30 mb-4 font-mono">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Testimonials Section ---
export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Frontend Developer",
      text: "PostulaYa me ayudó a organizar más de 30 aplicaciones. Conseguí mi trabajo actual gracias a no perder el hilo de las entrevistas.",
      rating: 5,
    },
    {
      name: "Laura Gómez",
      role: "UX/UI Designer",
      text: "Me encanta el modo oscuro y la interfaz limpia. Puedo ver todo mi pipeline de un vistazo sin hojas de cálculo aburridas.",
      rating: 5,
    },
    {
      name: "Andrés Silva",
      role: "Fullstack Engineer",
      text: "Increíblemente rápido y gratis. Cambiar el estado directamente en los badges me ahorra mucho tiempo.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Lo que dicen los profesionales
            </h2>
            <p className="text-muted-foreground mt-2">
              Desarrolladores y diseñadores que impulsaron su búsqueda con PostulaYa.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <Card className="border-border/50 bg-card p-6 space-y-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4" weight="fill" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- FAQ Section ---
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿PostulaYa es realmente gratuito?",
      a: "Sí, es 100% gratuito sin límites ocultos ni pruebas temporales. No requieres tarjeta de crédito.",
    },
    {
      q: "¿Mis datos de postulaciones están seguros?",
      a: "Tus datos están protegidos por autenticación de Supabase con Row Level Security (RLS). Solo tú tienes acceso a tus registros.",
    },
    {
      q: "¿Puedo acceder desde mi teléfono celular?",
      a: "Absolutamente. PostulaYa es completamente responsivo y se adapta tanto a pantallas móviles como a escritorio.",
    },
    {
      q: "¿Cómo cambio entre el modo claro y oscuro?",
      a: "Puedes usar el botón del sol/luna ubicado en el header para alternar con la animación circular interactiva.",
    },
  ];

  return (
    <section className="py-24 border-t border-border/50 bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-muted-foreground mt-2">
              Todo lo que necesitas saber antes de comenzar.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <CaretDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 pt-0 text-xs leading-relaxed text-muted-foreground border-t border-border/30">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
