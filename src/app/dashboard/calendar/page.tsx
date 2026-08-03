import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getJobs } from "@/actions/jobs";
import { getReminders } from "@/actions/reminders";
import { CalendarView } from "@/components/features/CalendarView";

export default async function CalendarPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const jobs = await getJobs();
  const reminders = await getReminders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CalendarView jobs={jobs} reminders={reminders} />
    </div>
  );
}
