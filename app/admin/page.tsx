import type { Metadata } from "next";

import { logoutAction } from "@/app/admin/actions";
import { Reveal } from "@/components/ui/reveal";
import { getAdminQuickLinksForAdmin } from "@/lib/sanity/data";
import { QuickLinksManager } from "@/components/admin/quick-links-manager";
import { PostsManager } from "@/components/admin/posts-manager";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 120;

export default async function AdminDashboardPage() {
  const { redirect } = await import("next/navigation");
  const { getAdminSession } = await import("@/lib/auth");

  const session = await getAdminSession();
  if (!session?.isAdmin) {
    redirect("/admin/login");
  }

  const adminCards = await getAdminQuickLinksForAdmin();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 pt-12 sm:pb-14 sm:pt-14 md:px-6 md:pb-16 md:pt-20">
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">Private Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Admin Control Center</h1>
          <p className="mt-2 text-sm text-slate-300">Manage quick links and content through this interface.</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="focus-ring rounded-xl border border-slate-500/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-300/75 hover:text-white"
          >
            Sign Out
          </button>
        </form>
      </Reveal>

      <div className="mt-8 space-y-8">
        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white">Quick Links</h2>
          <p className="mt-1 text-sm text-slate-300">Configure dashboard shortcuts and external utilities.</p>
          <div className="mt-4">
            <QuickLinksManager initialLinks={adminCards} />
          </div>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white">Blog Posts</h2>
            <p className="mt-1 text-sm text-slate-300">Create and maintain your latest articles.</p>
            <div className="mt-4">
              <PostsManager />
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white">Projects</h2>
            <p className="mt-1 text-sm text-slate-300">Manage project listings and portfolio highlights.</p>
            <div className="mt-4">
              <ProjectsManager />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
