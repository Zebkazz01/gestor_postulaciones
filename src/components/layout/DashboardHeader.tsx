"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, SignOut, User, SquaresFour, CaretDown, CheckCircle } from "@phosphor-icons/react";

interface DashboardHeaderProps {
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export function DashboardHeader({
  email,
  fullName,
  avatarUrl,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const displayName = fullName || email.split("@")[0];

  const isPostulacionesActive = pathname === "/dashboard";
  const isProfileActive = pathname === "/dashboard/profile";

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.add({
        title: "Sesión cerrada",
        description: "Hasta pronto",
        type: "info",
      });
      router.push("/login");
      router.refresh();
    } catch {
      toast.add({
        title: "Error al cerrar sesión",
        description: "Inténtalo de nuevo",
        type: "error",
      });
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold tracking-tight text-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Briefcase className="h-4 w-4" weight="bold" />
            </div>
            <span>PostulaYa</span>
          </Link>

          {/* Active Navigation Bar */}
          <nav className="flex items-center gap-1.5 text-xs font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isPostulacionesActive
                  ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isPostulacionesActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
              Postulaciones
            </Link>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isProfileActive
                  ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isProfileActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
              Mi Perfil
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="gap-2 px-2 sm:px-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
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
                  <span className="hidden text-sm font-medium sm:inline max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <CaretDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col p-2 text-xs">
                <span className="font-semibold text-sm text-foreground truncate">
                  {displayName}
                </span>
                <span className="text-muted-foreground truncate">{email}</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <SquaresFour className="mr-2 h-4 w-4" />
                Postulaciones
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <SignOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
