import React from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

interface PageShellProps {
  children: React.ReactNode;
  noFooter?: boolean;
  noPadding?: boolean;
  fullWidth?: boolean;
}

export default function PageShell({ children, noFooter, noPadding, fullWidth }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-50 flex flex-col">
      <SiteNav />
      <main className={noPadding ? "flex-1" : `flex-1 ${fullWidth ? "" : "max-w-6xl mx-auto w-full"} px-4 sm:px-6 lg:px-8 py-8`}>
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
