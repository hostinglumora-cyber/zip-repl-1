import React from "react";
import DocsLayout from "@/components/DocsLayout";

export default function Privacy() {
  return (
    <DocsLayout title="Privacy Policy" description="Last updated August 23, 2026. How Siren handles your data.">
      <Block title="1. Data we collect">
        <p>We collect your email, display name, and profile information when you create an account. Listing data (titles, descriptions, images, codes) is stored to power the marketplace.</p>
      </Block>
      <Block title="2. How we use it">
        <p>Your data is used to display listings, process transactions, and provide seller analytics. We never sell your personal information to third parties.</p>
      </Block>
      <Block title="3. Public profile">
        <p>Your profile, listings, and reviews are public. Contact details (Roblox username, email) are only shared with sellers when you make a purchase.</p>
      </Block>
      <Block title="4. Storage & retention">
        <p>Data is stored securely. You can request deletion of your account and listings at any time.</p>
      </Block>
      <Block title="5. Cookies">
        <p>We use essential cookies for authentication and site functionality. No tracking cookies are used.</p>
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