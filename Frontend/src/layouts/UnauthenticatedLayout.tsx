import { ShieldCheck } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function UnauthenticatedLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden animate-morph-rotate">
        {/* Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-violet-100" />

        {/* Aurora */}
        <div className="absolute inset-[-30%] animate-morph">
          <div className="animate-blob-1 absolute -left-[25%] top-[5%] h-[1100px] w-[1100px] rounded-full bg-blue-500/70 blur-[180px]" />

          <div className="animate-blob-2 absolute -right-[25%] top-[20%] h-[1000px] w-[1000px] rounded-full bg-violet-500/70 blur-[180px]" />

          <div className="animate-blob-3 absolute bottom-[-20%] left-[20%] h-[900px] w-[900px] rounded-full bg-cyan-400/60 blur-[170px]" />

          <div className="animate-blob-4 absolute bottom-[5%] right-[10%] h-[800px] w-[800px] rounded-full bg-fuchsia-500/55 blur-[170px]" />

          <div className="animate-blob-5 absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/50 blur-[180px]" />
        </div>

        {/* Floating stars */}
        <div className="absolute inset-0 animate-stars opacity-70" />
        <div className="absolute inset-0 animate-stars-reverse opacity-40" />
        <div className="absolute inset-0 stars-small opacity-70" />
        <div className="absolute inset-0 stars-big opacity-60" />
        <div className="absolute inset-0 stars-twinkle opacity-100" />

        {/* Spotlight */}
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[150px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Branding */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-900">Sentinel</h1>

          <p className="mt-3 text-lg text-slate-600">API Monitoring Platform</p>
        </div>

        {/* Form */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
