import React from "react";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Marketplace", to: "/marketplace" },
      { label: "Creators", to: "/creators" },
      { label: "Hosting", to: "/hosting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "Status", to: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/tos" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#090A0F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-sm font-bold text-slate-100">
              Liberty<span className="text-emerald-400">X</span>
            </Link>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              The ER:LC marketplace.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                {col.title}
              </h4>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs text-slate-600">
          © {new Date().getFullYear()} LibertyX
        </div>
      </div>
    </footer>
  );
}
