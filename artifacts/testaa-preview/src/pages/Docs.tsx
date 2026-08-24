import React from "react";
import DocsLayout from "@/components/DocsLayout";
import { ArrowRight, ShieldCheck, Package, Boxes, Gift, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

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
      <section id="intro" className="scroll-mt-24 mb-10">
        <h2>What is Liberty Marketplace?</h2>
        <p>Liberty Marketplace is the creator-first marketplace for ER:LC (Emergency Response: Liberty County) assets — liveries, uniforms, ELS configurations, map templates, and bundles. Browse by department, find the right fit, and publish your own work without listing fees.</p>
      </section>

      <section id="marketplace" className="scroll-mt-24 mb-10">
        <h2>Browsing the marketplace</h2>
        <p>Head to the <Link to="/marketplace">marketplace</Link> and filter by department (Police, Fire, Sheriff, DOT, or ERLC), category, and price. Use the search bar to find specific listings or sellers.</p>
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex gap-3 my-5">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">Look for the scam-protected badge â codes are only released to buyers after payment is confirmed.</p>
        </div>
      </section>

      <section id="selling" className="scroll-mt-24 mb-10">
        <h2>Selling your first asset</h2>
        <p>The listing flow has five steps:</p>
        <ol className="space-y-3 my-5">
          {[["Type", "Choose Single, Bundle, Free, or Code."], ["Details", "Add a title, headline, description, department tags, and price."], ["Media", "Upload up to 10 photos of your asset."], ["Codes", "Paste the codes the buyer receives after purchase."], ["Submit", "Agree to the marketplace rules and publish."]].map(([t, d], i) => (
            <li key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
              <div><span className="font-medium text-foreground">{t}</span> â <span className="text-muted-foreground">{d}</span></div>
            </li>
          ))}
        </ol>
        <p>Free listings are always allowed. Paid listings are priced in Robux.</p>
      </section>

      <section id="types" className="scroll-mt-24 mb-10">
        <h2>Listing types</h2>
        <div className="space-y-3 my-5">
          {[
            { icon: Package, name: "Single", desc: "One livery, uniform, ELS pack, etc." },
            { icon: Boxes, name: "Bundle", desc: "Multiple assets sold together with a custom headline." },
            { icon: Gift, name: "Free", desc: "A completely free product â codes revealed instantly." },
            { icon: Code2, name: "Code", desc: "A redeemable digital code delivered to the buyer." },
          ].map((t) => (
            <div key={t.name} className="flex gap-3 rounded-lg border border-border bg-card p-3.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center shrink-0"><t.icon className="w-4 h-4 text-primary" /></div>
              <div><p className="font-medium text-foreground text-sm">{t.name}</p><p className="text-sm text-muted-foreground">{t.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="codes" className="scroll-mt-24 mb-10">
        <h2>Codes</h2>
        <p>Codes are kept separate from your product description. Add them in the Codes step of the listing flow. For free items, codes are revealed instantly when a buyer claims the product. For paid items, codes are only released after payment is confirmed.</p>
      </section>

      <div className="mt-12 pt-8 border-t border-border">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-primary hover:opacity-70 font-medium">
          Explore the marketplace <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </DocsLayout>
  );
}