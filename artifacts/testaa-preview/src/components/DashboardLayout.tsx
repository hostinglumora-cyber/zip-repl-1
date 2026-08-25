import React from "react";
import { Outlet } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}