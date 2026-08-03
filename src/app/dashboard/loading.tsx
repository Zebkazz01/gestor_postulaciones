import { CircleNotch, Briefcase } from "@phosphor-icons/react/dist/ssr";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-4 rounded-2xl border border-border/30 bg-card/30 p-8 backdrop-blur-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <Briefcase className="h-7 w-7 animate-bounce" weight="bold" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <CircleNotch className="h-4 w-4 animate-spin text-primary" />
          <span>Cargando vista...</span>
        </div>
      </div>
    </div>
  );
}
