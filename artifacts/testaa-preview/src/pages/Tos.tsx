import React from "react";
import DocsLayout from "@/components/DocsLayout";

export default function Tos() {
  return (
    <DocsLayout title="Terms of Service" description="Last updated August 23, 2026. The rules for using Siren.">
      <Block title="1. Eligibility">
        <p>By using Siren you confirm you may legally enter into these terms and have the rights to any assets you list.</p>
      </Block>
      <Block title="2. Permitted content">
        <p>You may list liveries, uniforms, ELS configurations, map templates, and bundles that you created or have explicit permission to sell. Stolen, leaked, or misrepresented assets are prohibited and will be removed.</p>
      </Block>
      <Block title="3. Scam & fraud policy">
        <p>Selling fake codes, failing to deliver after payment, or misrepresenting listings results in an immediate permanent ban. Siren uses scam-protection to hold codes until payment is confirmed.</p>
      </Block>
      <Block title="4. Free and paid listings">
        <p>Free listings are allowed at no cost. Paid listings are priced in Robux. Siren may apply service fees to paid transactions, disclosed before checkout.</p>
      </Block>
      <Block title="5. Account bans">
        <p>Administrators may ban accounts that violate these terms. Banned users lose access to the marketplace and their listings may be removed.</p>
      </Block>
      <Block title="6. Liability">
        <p>Siren is a platform connecting buyers and sellers. We are not responsible for the quality or functionality of third-party assets, but we mediate disputes and enforce our scam-protection guarantee.</p>
      </Block>
      <Block title="7. Changes">
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      </Block>
    </DocsLayout>
  );
}

function Block({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}