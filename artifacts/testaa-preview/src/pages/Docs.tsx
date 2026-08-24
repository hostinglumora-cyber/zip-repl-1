import React from "react";
import DocsLayout from "@/components/DocsLayout";
import {
  ShieldCheck, Package, Boxes, Gift, Code2,
  Upload, KeyRound, Rocket, Pencil, ArrowRight,
  Info, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <DocsLayout
      title="Introduction"
      description="Learn how Liberty Marketplace works — browsing, buying, and selling ER:LC assets for Liberty County."
      toc={[
        { id: "overview", label: "Overview" },
        { id: "browsing", label: "Browsing" },
        { id: "selling", label: "Selling" },
        { id: "listing-types", label: "Listing types" },
        { id: "codes", label: "Codes" },
      ]}
    >

      {/* ── Overview ── */}
      <section id="overview" className="scroll-mt-20 mb-10">
        <h2 className="docs-h2">Overview</h2>
        <p className="docs-p">
          Liberty Marketplace is the creator-first hub for ER:LC (Emergency Response: Liberty County) assets — liveries, uniforms, ELS configurations, map templates, and bundles. Browse by department, find the right fit, and publish your own work with zero listing fees.
        </p>

        {/* Quick-start cards */}
        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          {[
            { emoji: "🛒", title: "Browse assets", desc: "Filter by department, category, or price.", to: "/marketplace" },
            { emoji: "🚀", title: "Sell an asset", desc: "Publish in minutes, no fees.", to: "/sell" },
            { emoji: "📖", title: "Read the guide", desc: "Follow the full docs below.", to: "#selling" },
          ].map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 p-4 transition"
            >
              <span className="text-2xl">{card.emoji}</span>
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">{card.title}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">{card.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browsing ── */}
      <section id="browsing" className="scroll-mt-20 mb-10">
        <h2 className="docs-h2">Browsing the marketplace</h2>
        <p className="docs-p">
          Head to the{" "}
          <Link to="/marketplace" className="docs-link">marketplace</Link>{" "}
          and filter by department (Police, Fire, Sheriff, DOT, or ERLC), category, and price. Use the search bar to find specific listings or sellers.
        </p>

        <Callout type="tip" title="Scam protection">
          Codes are only released to buyers after payment is confirmed — every paid listing is scam-protected by default.
        </Callout>
      </section>

      {/* ── Selling ── */}
      <section id="selling" className="scroll-mt-20 mb-10">
        <h2 className="docs-h2">Selling your first asset</h2>
        <p className="docs-p">The listing flow has five steps. Click <Link to="/sell" className="docs-link">List an asset</Link> to begin.</p>

        <div className="mt-5 space-y-3">
          {([
            { icon: Package,   step: 1, title: "Type",    desc: "Choose Single, Bundle, Free, or Code." },
            { icon: Pencil,    step: 2, title: "Details", desc: "Title, headline, description, departments, and price." },
            { icon: Upload,    step: 3, title: "Media",   desc: "Upload up to 10 photos of your asset." },
            { icon: KeyRound,  step: 4, title: "Codes",   desc: "Paste the codes the buyer receives after purchase." },
            { icon: Rocket,    step: 5, title: "Submit",  desc: "Agree to marketplace rules and publish." },
          ] as const).map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {step}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="Pricing">
          Free listings are always allowed. Paid listings are priced in Robux (R$).
        </Callout>
      </section>

      {/* ── Listing types ── */}
      <section id="listing-types" className="scroll-mt-20 mb-10">
        <h2 className="docs-h2">Listing types</h2>
        <p className="docs-p">Every listing is one of four types — choose based on what you're selling.</p>

        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          {([
            { icon: Package, name: "Single",  color: "text-primary",    bg: "bg-primary/10",    desc: "One livery, uniform, ELS pack, or other standalone asset." },
            { icon: Boxes,   name: "Bundle",  color: "text-blue-400",   bg: "bg-blue-400/10",   desc: "Multiple assets sold together at one price with a shared headline." },
            { icon: Gift,    name: "Free",    color: "text-amber-400",  bg: "bg-amber-400/10",  desc: "A completely free product — codes are revealed to the buyer instantly." },
            { icon: Code2,   name: "Code",    color: "text-violet-400", bg: "bg-violet-400/10", desc: "A redeemable digital code delivered to the buyer on purchase." },
          ] as const).map(({ icon: Icon, name, color, bg, desc }, i, arr) => (
            <div
              key={name}
              className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Codes ── */}
      <section id="codes" className="scroll-mt-20 mb-10">
        <h2 className="docs-h2">Codes</h2>
        <p className="docs-p">
          Codes are kept separate from your product description and entered in step 4 of the listing flow. They are stored securely and delivered to buyers automatically.
        </p>

        <div className="mt-5 rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-secondary/60 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Code delivery rules</p>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center gap-3 px-5 py-4">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-sm font-medium text-foreground">Free listing</span>
                <span className="text-sm text-muted-foreground"> — codes revealed instantly when claimed.</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-sm font-medium text-foreground">Paid listing</span>
                <span className="text-sm text-muted-foreground"> — codes released only after payment is confirmed.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground">Ready to explore?</p>
          <p className="text-sm text-muted-foreground mt-1">Browse active listings or publish your first asset — no fees required.</p>
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shrink-0"
        >
          Open marketplace <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </DocsLayout>
  );
}

/* ── Callout component ── */
function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info:    { border: "border-blue-500/30",   bg: "bg-blue-500/5",   icon: Info,         iconClass: "text-blue-400" },
    tip:     { border: "border-primary/30",    bg: "bg-primary/5",    icon: ShieldCheck,  iconClass: "text-primary" },
    warning: { border: "border-amber-500/30",  bg: "bg-amber-500/5",  icon: AlertCircle,  iconClass: "text-amber-400" },
  }[type];
  const Icon = styles.icon;
  return (
    <div className={`mt-5 flex gap-3 rounded-xl border ${styles.border} ${styles.bg} px-4 py-4`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${styles.iconClass}`} />
      <div className="text-sm text-muted-foreground leading-relaxed">
        {title && <span className="font-semibold text-foreground mr-1">{title}.</span>}
        {children}
      </div>
    </div>
  );
}
