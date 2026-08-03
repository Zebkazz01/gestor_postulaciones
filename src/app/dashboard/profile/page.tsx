import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getJobs } from "@/actions/jobs";
import { ProfileForm } from "@/components/features/ProfileForm";
import { PasswordForm } from "@/components/features/PasswordForm";
import { DeleteAccountCard } from "@/components/features/DeleteAccountCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Key, ArrowLeft, EnvelopeSimple, ShieldCheck, Briefcase, Sparkle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const fullName = user.user_metadata?.full_name ?? "";
  const avatarUrl = user.user_metadata?.avatar_url ?? "";
  const displayName = fullName || email.split("@")[0];

  const jobs = await getJobs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back navigation button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-card px-3 py-1.5 rounded-lg border border-border/40"
        >
          <ArrowLeft className="h-4 w-4" weight="bold" />
          Volver a Mis Postulaciones
        </Link>
      </div>

      {/* Hero Profile Banner Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-r from-primary/10 via-card to-background p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar Ring */}
          <div className="relative">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-primary font-bold text-3xl ring-4 ring-primary/30 shadow-xl">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-background">
              <ShieldCheck className="h-4 w-4" weight="bold" />
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  {displayName}
                  <Sparkle className="h-5 w-5 text-amber-400 fill-amber-400" />
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <EnvelopeSimple className="h-4 w-4 text-primary" />
                  {email}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary self-center sm:self-auto">
                <Briefcase className="h-4 w-4" weight="bold" />
                {jobs.length} {jobs.length === 1 ? "Postulación Registrada" : "Postulaciones Registradas"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Card 1: Información Personal & Avatar */}
        <Card className="border-border/50 bg-card shadow-sm hover:border-border transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" weight="bold" />
              </div>
              <div>
                <CardTitle className="text-xl">Datos Personales</CardTitle>
                <CardDescription>
                  Personaliza tu nombre y selecciona tu avatar preferido
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProfileForm
              email={email}
              initialFullName={fullName}
              initialAvatarUrl={avatarUrl}
            />
          </CardContent>
        </Card>

        {/* Card 2 & 3: Cambiar Contraseña y Eliminar Cuenta */}
        <div className="space-y-8">
          <Card className="border-border/50 bg-card shadow-sm hover:border-border transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Key className="h-5 w-5" weight="bold" />
                </div>
                <div>
                  <CardTitle className="text-xl">Cambiar Contraseña</CardTitle>
                  <CardDescription>
                    Actualiza tu clave con verificación de seguridad
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>

          {/* Card 3: Eliminar Cuenta */}
          <DeleteAccountCard />
        </div>
      </div>
    </div>
  );
}
