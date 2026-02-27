import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false
  }
};

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next || "/admin";

  return (
    <section className="mx-auto w-full max-w-md px-4 pb-16 pt-20">
      <Reveal className="glass-panel rounded-2xl p-6 md:p-8">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-300/90">Private Route</p>
        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Only authorized users can access content management tools.</p>
        <div className="mt-6">
          <AdminLoginForm nextPath={nextPath} />
        </div>
      </Reveal>
    </section>
  );
}