import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DocsLayout from "@/components/DocsLayout";
import { MintSteps, MintStep } from "@/components/docs/MintSteps";
import { MintCard, MintCardGroup } from "@/components/docs/MintCard";
import { MintCallout } from "@/components/docs/MintCallout";
import { MintCodeTabs } from "@/components/docs/MintCodeTabs";
import {
  Sparkles,
  ShoppingBag,
  UploadCloud,
  ShieldCheck,
  Code2,
  Boxes,
  Gift,
  KeyRound,
  Terminal,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  FileCheck,
  Lock,
  Radio,
  UserCheck,
  Webhook,
  Database,
  Cpu,
  BadgeAlert,
  HelpCircle,
  Clock,
  Compass,
  Server,
  Palette,
  Tag,
  MessageCircle,
} from "lucide-react";

export default function Docs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page") || "quickstart";
  const [currentPage, setCurrentPage] = useState<string>(pageParam);

  useEffect(() => {
    const p = searchParams.get("page") || "quickstart";
    setCurrentPage(p);
  }, [searchParams]);

  const handleSelectPage = (pageId: string) => {
    setCurrentPage(pageId);
    setSearchParams({ page: pageId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 1. QUICKSTART */}
      {currentPage === "quickstart" && (
        <DocsLayout
          title="Quickstart Guide"
          badge="Start Here"
          description="Get up and running with LibertyX Marketplace in under 5 minutes. Discover, purchase, or publish ER:LC emergency assets."
          readingTime="3 min read"
          currentPageId="quickstart"
          onSelectPage={handleSelectPage}
          nextPage={{ label: "Account Setup", pageId: "account" }}
          toc={[
            { id: "intro", label: "Overview" },
            { id: "step-1", label: "1. Create Account & Link Roblox" },
            { id: "step-2", label: "2. Explore Department Assets" },
            { id: "step-3", label: "3. Publish Your First Listing" },
            { id: "step-4", label: "4. Automated Code Delivery" },
          ]}
        >
          <section id="intro" className="scroll-mt-24">
            <p>
              Welcome to <strong>LibertyX Marketplace</strong> — the modern, scam-protected marketplace built for Emergency Response: Liberty County (ER:LC) creators and communities. Whether you are searching for state police liveries or selling custom uniform packs, this guide gets you started immediately.
            </p>

            <MintCardGroup cols={2}>
              <MintCard
                title="Browse Marketplace"
                description="Explore liveries, uniforms, ELS configs, and server templates."
                icon={ShoppingBag}
                to="/marketplace"
                tag="Store"
              />
              <MintCard
                title="Become a Creator"
                description="Upload your assets and earn Robux with 0% listing fees."
                icon={UploadCloud}
                to="/sell"
                tag="Publish"
              />
            </MintCardGroup>
          </section>

          <MintCallout type="tip" title="Zero Listing Fees">
            LibertyX Marketplace is 100% free to join and publish listings. Creators keep their full listed value with instant automated escrow release.
          </MintCallout>

          <section id="step-1" className="scroll-mt-24">
            <MintSteps>
              <MintStep stepNumber={1} title="Sign in with Discord & Connect Roblox">
                <p>
                  Click <strong>Login</strong> in the top navigation. Authenticate through Discord to verify your identity, then search and confirm your authentic Roblox username.
                </p>
              </MintStep>

              <MintStep stepNumber={2} title="Browse or Search by Hashtag">
                <p>
                  Filter by <strong>Law Enforcement</strong>, <strong>Sheriff</strong>, <strong>Fire & Rescue</strong>, <strong>DOT</strong>, or <strong>Map Templates</strong>. Use hashtags like <code>#Tahoe</code> or <code>#CrownVic</code> for instant vehicle model matches.
                </p>
              </MintStep>

              <MintStep stepNumber={3} title="Instant Deliverable Key Unlock">
                <p>
                  Purchases immediately reveal deliverable Roblox Asset IDs, Pastebin hashes, or direct image template files directly on your receipt and order history.
                </p>
              </MintStep>
            </MintSteps>
          </section>
        </DocsLayout>
      )}

      {/* 2. SELLING & 0% FEE */}
      {currentPage === "selling" && (
        <DocsLayout
          title="Become a Verified Creator"
          badge="0% Commission"
          description="Sell ER:LC liveries, uniform packages, and custom map templates with zero platform cuts."
          currentPageId="selling"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Quickstart", pageId: "quickstart" }}
          nextPage={{ label: "Create a Listing", pageId: "create-listing" }}
          toc={[
            { id: "overview", label: "0% Commission Model" },
            { id: "verification", label: "Creator Provenance" },
            { id: "publishing", label: "Listing Formats" },
          ]}
        >
          <section id="overview" className="scroll-mt-24">
            <p>
              LibertyX empowers ER:LC livery designers and uniform creators by eliminating transaction cuts. You retain 100% of listed proceeds.
            </p>

            <MintCallout type="check" title="No Hidden Listing Charges">
              Publishing is free for single skins, multi-vehicle agency bundles, and community map templates.
            </MintCallout>
          </section>

          <section id="publishing" className="scroll-mt-24">
            <MintCardGroup cols={3}>
              <MintCard
                title="Single Vehicle Livery"
                description="Custom livery texture for a single vehicle model."
                icon={Boxes}
                to="/sell"
              />
              <MintCard
                title="Agency Fleet Bundle"
                description="Matching liveries across multiple department vehicles."
                icon={Layers}
                to="/sell"
              />
              <MintCard
                title="Map Templates"
                description="Custom station layouts and training facility builds."
                icon={ShieldCheck}
                to="/sell"
              />
            </MintCardGroup>
          </section>
        </DocsLayout>
      )}

      {/* 3. STOREFRONTS */}
      {currentPage === "storefront-builder" && (
        <DocsLayout
          title="Personal Storefront Builder"
          badge="Custom Store"
          description="Design your personal marketplace with custom branding, commission status badges, and custom services."
          currentPageId="storefront-builder"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Selling", pageId: "selling" }}
          nextPage={{ label: "Community Hosting", pageId: "hosting-overview" }}
          toc={[
            { id: "urls", label: "Clean Storefront URLs" },
            { id: "builder", label: "Customization Studio" },
            { id: "services", label: "Custom Commission Slots" },
          ]}
        >
          <section id="urls" className="scroll-mt-24">
            <p>
              Every creator gets a dedicated, shareable website inside LibertyX:
            </p>
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-emerald-400 text-xs">
              libertyx.com/u/yourname &nbsp;·&nbsp; libertyx.com/yourname
            </div>
          </section>

          <section id="services" className="scroll-mt-24">
            <p>
              Offer custom services (e.g. Custom Livery Design, Discord Server Setup) with turnaround estimates and direct internal messaging integration.
            </p>
          </section>
        </DocsLayout>
      )}

      {/* 4. COMMUNITY HOSTING */}
      {currentPage === "hosting-overview" && (
        <DocsLayout
          title="LibertyX Community Hosting ($12.99/mo)"
          badge="Cloud Nodes"
          description="High-speed hosting for ER:LC roleplay bots, CAD/MDT systems, and automated Discord webhook relays."
          currentPageId="hosting-overview"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Storefronts", pageId: "storefront-builder" }}
          nextPage={{ label: "REST API Reference", pageId: "api" }}
          toc={[
            { id: "features", label: "Hosting Architecture" },
            { id: "specs", label: "Container Specifications" },
            { id: "deploy", label: "1-Click Deployment" },
          ]}
        >
          <section id="features" className="scroll-mt-24">
            <p>
              LibertyX Community Hosting provides cloud nodes optimized for ER:LC roleplay servers at <strong>$12.99 USD / month</strong>.
            </p>

            <MintCardGroup cols={2}>
              <MintCard
                title="ER:LC Bot Supervisor"
                description="Automatic restarts, 99.99% uptime, and live container logs."
                icon={Server}
                to="/hosting"
                tag="$12.99/mo"
              />
              <MintCard
                title="Protected Secrets"
                description="Secure environment variables for bot tokens and API keys."
                icon={Lock}
                to="/hosting"
                tag="Security"
              />
            </MintCardGroup>
          </section>

          <section id="specs" className="scroll-mt-24">
            <div className="rounded-xl border border-white/[0.08] bg-[#0A0D15] p-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-zinc-500">Memory Allocation:</span>
                <span className="text-white font-bold">2,048 MB DDR4</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-zinc-500">Network Gateway:</span>
                <span className="text-emerald-400 font-bold">&lt; 18ms Discord ping</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Pricing Model:</span>
                <span className="text-white font-bold">$12.99 USD / month</span>
              </div>
            </div>
          </section>
        </DocsLayout>
      )}

      {/* 5. REST API */}
      {currentPage === "api" && (
        <DocsLayout
          title="REST API Reference"
          badge="v1.0"
          description="Programmatically query listings, creator storefronts, and escrow delivery status."
          currentPageId="api"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Community Hosting", pageId: "hosting-overview" }}
          toc={[
            { id: "endpoint", label: "GET /api/v1/listings" },
            { id: "auth", label: "Authentication" },
          ]}
        >
          <section id="endpoint" className="scroll-mt-24">
            <MintCodeTabs
              tabs={[
                {
                  label: "JavaScript",
                  language: "javascript",
                  code: `const res = await fetch("https://libertyx.com/api/v1/listings?category=Law+Enforcement");
const data = await res.json();
console.log(data.listings);`,
                },
                {
                  label: "cURL",
                  language: "bash",
                  code: `curl -X GET "https://libertyx.com/api/v1/listings?category=Law+Enforcement" \\
  -H "Accept: application/json"`,
                },
              ]}
            />
          </section>
        </DocsLayout>
      )}

      {/* Fallback for other doc pages */}
      {!["quickstart", "selling", "storefront-builder", "hosting-overview", "api"].includes(currentPage) && (
        <DocsLayout
          title={currentPage.replace("-", " ").toUpperCase()}
          badge="Docs"
          description={`Comprehensive guide and technical documentation for ${currentPage}.`}
          currentPageId={currentPage}
          onSelectPage={handleSelectPage}
        >
          <p>
            Documentation section for <strong>{currentPage}</strong>. Refer to the Quickstart and API guide for complete developer workflows.
          </p>
          <MintCard
            title="Return to Quickstart"
            description="Explore the main getting started guide."
            icon={Sparkles}
            to="/docs?page=quickstart"
          />
        </DocsLayout>
      )}
    </>
  );
}
