import React from "react";
import DocsLayout from "@/components/DocsLayout";
import { BRAND } from "@/lib/brand";

export default function Tos() {
  return (
    <DocsLayout title="Terms of Service" description={`Last updated August 24, 2026. The rules for using ${BRAND.name}.`}>
      <Block title="1. Eligibility">
        <p>By using LibertyX Marketplace you confirm you may legally enter into these terms and have the rights to any assets you list.</p>
      </Block>
      <Block title="2. Permitted content">
        <p>You may list liveries, uniforms, ELS configurations, map templates, and fleet bundles that you created or have explicit permission to sell. Stolen, leaked, or misrepresented assets are strictly prohibited and will be removed.</p>
      </Block>
      <Block title="3. Scam & fraud policy">
        <p>Selling fake codes, failing to deliver after payment, or misrepresenting listings results in an immediate permanent ban. LibertyX uses automated Scam-Shield escrow to hold codes until payment is verified.</p>
      </Block>
      <Block title="4. Free and paid listings">
        <p>Free listings are allowed at 0% fees. Paid listings are priced in Robux. LibertyX maintains a 0% listing fee policy for community creators.</p>
      </Block>
      <Block title="5. Account bans">
        <p>Administrators may ban accounts that violate these terms. Banned users lose access to the marketplace and their active listings may be removed.</p>
      </Block>
      <Block title="6. Liability">
        <p>LibertyX is a platform connecting creators and buyers. We mediate disputes and enforce our scam-protection guarantee.</p>
      </Block>
      <Block title="7. Changes">
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      </Block>
    </DocsLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3 text-foreground">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
