import React from "react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { BRAND } from "@/lib/brand";

export default function Privacy() {
  return (
    <PageShell>
      <PageHeader title="Privacy Policy" description={`Last updated August 24, 2026. How ${BRAND.name} handles your data.`} />
      <div className="max-w-3xl">
        <Block title="1. Data we collect">
          <p>We collect your email, display name, and profile information when you create an account or sign in with Discord. Listing data (titles, descriptions, images, deliverable codes) is securely stored to power the marketplace.</p>
        </Block>
        <Block title="2. How we use it">
          <p>Your data is used to display listings, process transactions, deliver escrow codes, and provide seller analytics. We never sell your personal information to third parties.</p>
        </Block>
        <Block title="3. Public profile">
          <p>Your creator profile, active listings, and customer reviews are public. Contact details and private deliverable tokens are only shared with buyers once payment is confirmed.</p>
        </Block>
        <Block title="4. Storage & retention">
          <p>Data is stored securely. You can request deletion of your account and listings at any time.</p>
        </Block>
        <Block title="5. Cookies">
          <p>We use essential cookies for authentication and site functionality. No tracking cookies are used.</p>
        </Block>
      </div>
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3 text-slate-50 tracking-tight">{title}</h2>
      <div className="text-sm text-slate-400 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
