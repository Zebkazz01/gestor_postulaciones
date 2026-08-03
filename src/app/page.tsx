import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Hero3DMockup } from "@/components/landing/Hero3DMockup";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import {
  StatsSection,
  InteractiveDemoSection,
  HowItWorksSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/landing/LandingSections";
import {
  Briefcase,
  Lightning,
  ArrowRight,
  Heart,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <Briefcase className="h-4 w-4" weight="bold" />
            </div>
            <span>PostulaYa</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className={buttonVariants({
                variant: isLoggedIn ? "default" : "outline",
                size: "sm",
              })}
            >
              {isLoggedIn ? "Ir al Dashboard" : "Iniciar Sesión"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Background 3D Radial Lights */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-10 top-1/3 h-[450px] w-[450px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute left-10 bottom-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal direction="down">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs">
                <Lightning className="h-4 w-4 text-yellow-400" weight="fill" />
                100% gratuito · Sin tarjetas ni límites
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                Gestiona tu búsqueda laboral{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  en 3D y sin estrés
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mb-10 text-base text-muted-foreground sm:text-xl leading-relaxed">
                Organiza todas tus postulaciones en un solo lugar. Registra
                empresas, cargos, estados y notas para nunca perder el hilo de tu
                búsqueda laboral.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className={buttonVariants({
                    size: "lg",
                    className: "gap-2 text-base px-8 shadow-lg shadow-primary/20",
                  })}
                >
                  {isLoggedIn ? "Ir al Dashboard" : "Comenzar Gratis"}
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive 3D Mockup */}
          <Hero3DMockup />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Final Banner */}
      <section className="py-20 relative overflow-hidden border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-background p-8 sm:p-12 text-center shadow-2xl overflow-hidden">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <Sparkle className="h-6 w-6" weight="fill" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  ¿Listo para conseguir tu próxima oportunidad?
                </h2>
                <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground">
                  Únete a los profesionales que organizan sus postulaciones con PostulaYa y nunca más olvides una entrevista.
                </p>
                <div className="pt-2">
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/login"}
                    className={buttonVariants({
                      size: "lg",
                      className: "gap-2 px-8 text-base shadow-xl",
                    })}
                  >
                    {isLoggedIn ? "Ir al Dashboard" : "Empieza Ahora — Es Gratis"}
                    <ArrowRight className="h-4 w-4" weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <Briefcase className="h-4 w-4 text-primary" weight="bold" />
              PostulaYa © {new Date().getFullYear()}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Hecho con <Heart className="h-4 w-4 text-red-500" weight="fill" /> para tu desarrollo profesional
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
