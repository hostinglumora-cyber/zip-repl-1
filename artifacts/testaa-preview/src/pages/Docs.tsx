import React from "react";
import DocsLayout from "@/components/DocsLayout";
import { ArrowRight, ShieldCheck, Package, Boxes, Gift, Code2, Upload, KeyRound, Rocket, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  { icon: Package, title: "Type", desc: "Choose Single, Bundle, Free, or Code.", color: "text-primary" },
  { icon: Pencil, title: "Details", desc: "Add a title, headline, description, department tags, and price.", color: "text-blue-400" },
  { icon: Upload, title: "Media", desc: "Upload up to 10 photos of your asset.", color: "text-amber-400" },
  { icon: KeyRound, title: "Codes", desc: "Paste the codes the buyer receives after purchase.", color: "text-violet-400" },
  { icon: Rocket, title: "Submit", desc: "Agree to the marketplace rules and publish.", color: "text-primary" },
];

const TYPES = [
  { icon: Package, name: "Single", desc: "One livery, uniform, ELS pack, etc.", accent: "from-primary/20 to-primary/5" },
  { icon: Boxes, name: "Bundle", desc: "Multiple assets sold together with a custom headline.", accent: "from-blue-500/20 to-blue-500/5" },
  { icon: Gift, name: "Free", desc: "A completely free product — codes revealed instantly.", accent: "from-amber-500/20 to-amber-500/5" },
  { icon: Code2, name: "Code", desc: "A redeemable digital code delivered to the buyer.", accent: "from-violet-500/20 to-violet-500/5" },
];

export default function Docs() {
  return (
    <DocsLayout
      title="Build your Liberty County presence"
      description="Everything you need to browse, publish, and grow on Liberty Marketplace."
      toc={[
        { id: "intro", label: "What is Liberty Marketplace?" },
        { id: "marketplace", label: "Browsing the marketplace" },
        { id: "selling", label: "Selling your first asset" },
        { id: "types", label: "Listing types" },
        { id: "codes", label: "Codes" },
      ]}
    >
      <section id="intro" className="scroll-mt-24 mb-12">
        <SectionHeading>What is Liberty Marketplace?</SectionHeading>
        <p>Liberty Marketplace is the creator-first marketplace for ER:LC (Emergency Response: Liberty County) assets — liveries, uniforms, ELS configurations, map templates, and bundles. Browse by department, find the right fit, and publish your own work without listing fees.</p>
      </section>

      <section id="marketplace" className="scroll-mt-24 mb-12">
        <SectionHeading>Browsing the marketplace</SectionHeading>
        <p>Head to the <Link to="/marketplace">marketplace</Link> and filter by department (Police, Fire, Sheriff, DOT, or ERLC), category, and price. Use the search bar to find specific listings or sellers.</p>
        <div className="relative rounded-2xl bg-primary/[0.04] border border-primary/20 p-5 flex gap-4 my-6 overflow-hidden group">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-60" />
          <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center shrink-0 relative">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="relative">
            <p className="font-semibold text-foreground text-sm mb-1">Scam protection built in</p>
            <p className="text-sm text-muted-foreground leading-relaxed">Look for the scam-protected badge — codes are only released to buyers after payment is confirmed.</p>
          </div>
        </div>
      </section>

      <section id="selling" className="scroll-mt-24 mb-12">
        <SectionHeading>Selling your first asset</SectionHeading>
        <p>The listing flow has five steps:</p>
        <div className="relative my-6">
          {/* vertical connector line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/40 via-border to-primary/20" />
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-4 items-start relative">
                <span className="relative z-10 w-10 h-10 rounded-xl bg-card border border-border grid place-items-center shrink-0 group-hover:border-primary/30 transition">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </span>
                <div className="pt-1">
                  <span className="font-semibold text-foreground text-sm">{s.title}</span>
                  <span className="text-muted-foreground"> — {s.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p>Free listings are always allowed. Paid listings are priced in Robux.</p>
      </section>

      <section id="types" className="scroll-mt-24 mb-12">
        <SectionHeading>Listing types</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {TYPES.map((t) => (
            <div key={t.name} className="group relative rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/30 hover:bg-card transition duration-300 overflow-hidden">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${t.accent} blur-2xl opacity-50 group-hover:opacity-80 transition duration-500`} />
              <div className="relative flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center shrink-0 group-hover:scale-105 transition duration-300">
                  <t.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-0.5">{t.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="codes" className="scroll-mt-24 mb-12">
        <SectionHeading>Codes</SectionHeading>
        <p>Codes are kept separate from your product description. Add them in the Codes step of the listing flow. For free items, codes are revealed instantly when a buyer claims the product. For paid items, codes are only released after payment is confirmed.</p>
        <div className="my-6 rounded-2xl border border-border bg-card/60 p-5 overflow-hidden relative">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">code-delivery.flow</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-muted-foreground"><span className="text-foreground font-medium">Free item</span> → buyer claims → codes revealed instantly</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span className="text-muted-foreground"><span className="text-foreground font-medium">Paid item</span> → payment confirmed → codes released to buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-14 relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card/60 to-transparent p-8 lg:p-10 overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Ready to dive in?</h3>
            <p className="text-muted-foreground">Browse live listings or publish your first asset — no fees, no friction.</p>
          </div>
          <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90 shrink-0">
            Explore the marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DocsLayout>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl font-bold text-foreground mb-4 mt-10 flex items-center gap-3">
      <span className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary/30" />
      {children}
    </h2>
  );
}
