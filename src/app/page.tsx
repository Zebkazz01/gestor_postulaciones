import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  ChartBar,
  ShieldCheck,
  Lightning,
  ArrowRight,
  CheckCircle,
  Heart,
} from "@phosphor-icons/react/dist/ssr";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-4 w-4" weight="bold" />
            </div>
            PostulaYa
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
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground animate-fade-in">
              <Lightning className="h-4 w-4 text-yellow-400" weight="fill" />
              100% gratuito · Sin tarjeta de crédito
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-slide-up">
              Gestiona tu búsqueda laboral{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                sin estrés
              </span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground sm:text-xl animate-slide-up-delay">
              Organiza todas tus postulaciones en un solo lugar. Registra
              empresas, cargos, estados y notas para nunca perder el hilo de tu
              búsqueda.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up-delay-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className={buttonVariants({
                  size: "lg",
                  className: "gap-2 text-base px-8",
                })}
              >
                {isLoggedIn ? "Ir al Dashboard" : "Comenzar Gratis"}
                <ArrowRight className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="text-muted-foreground">
              Herramientas simples y poderosas para tu búsqueda laboral
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Briefcase}
              title="Organización Total"
              description="Registra cada postulación con empresa, cargo, enlace y notas. Todo organizado en un solo dashboard."
            />
            <FeatureCard
              icon={ChartBar}
              title="Seguimiento Visual"
              description="Visualiza el estado de cada postulación: Pendiente, Entrevista, Prueba Técnica, Oferta o Rechazado."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Privado y Seguro"
              description="Tus datos son solo tuyos. Autenticación segura y acceso exclusivo a tu información."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Benefits */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">
              ¿Por qué PostulaYa?
            </h2>
            <div className="space-y-4 text-left">
              {[
                "Registra postulaciones en segundos",
                "Filtra por estado para ver tu pipeline",
                "Nunca olvides el link de una oferta",
                "Funciona en cualquier dispositivo",
                "Sin costo, sin publicidad, sin complicaciones",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-400" weight="fill" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className={buttonVariants({
                  size: "lg",
                  className: "gap-2 px-8",
                })}
              >
                {isLoggedIn ? "Ir al Dashboard" : "Empieza ahora — Es gratis"}
                <ArrowRight className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              PostulaYa © {new Date().getFullYear()}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Hecho con <Heart className="h-4 w-4 text-red-500" weight="fill" /> para quienes buscan su próxima oportunidad
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" weight="duotone" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
