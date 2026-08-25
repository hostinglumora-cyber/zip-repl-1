import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DocsLayout from "@/components/DocsLayout";
import { MintSteps, MintStep } from "@/components/docs/MintSteps";
import { MintCard, MintCardGroup } from "@/components/docs/MintCard";
import { MintCallout } from "@/components/docs/MintCallout";
import { MintCodeTabs } from "@/components/docs/MintCodeTabs";
import { BRAND } from "@/lib/brand";
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
          description="Get up and running with LibertyX Marketplace in under 5 minutes. Discover, purchase, or publish emergency-services assets."
          readingTime="3 min read"
          currentPageId="quickstart"
          onSelectPage={handleSelectPage}
          nextPage={{ label: "Overview & Features", pageId: "overview" }}
          toc={[
            { id: "intro", label: "Overview" },
            { id: "step-1", label: "1. Create Account & Link Roblox" },
            { id: "step-2", label: "2. Explore Department Assets" },
            { id: "step-3", label: "3. Publish Your First Listing" },
            { id: "step-4", label: "4. Automated Code Delivery" },
            { id: "next-steps", label: "Next Steps" },
          ]}
        >
          <section id="intro" className="scroll-mt-24">
            <p className="text-base text-muted-foreground leading-relaxed">
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

          <div className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Get Started in 4 Simple Steps
            </h2>

            <MintSteps>
              <MintStep
                number={1}
                title="Create Account & Connect Roblox Identity"
                badge="Identity"
              >
                <div id="step-1" className="scroll-mt-24" />
                <p>
                  Sign in using Discord or email to unlock instant downloads, seller ratings, and order history.
                </p>
                <MintCallout type="note" title="Roblox Verification">
                  Linking your Roblox username unlocks verified creator status and enables automated in-game asset transfers.
                </MintCallout>
              </MintStep>

              <MintStep
                number={2}
                title="Explore Department Assets & Liveries"
                badge="Marketplace"
              >
                <div id="step-2" className="scroll-mt-24" />
                <p>
                  Filter hundreds of community-crafted assets by department: <strong>Police</strong>, <strong>Sheriff</strong>, <strong>Fire & Rescue</strong>, <strong>DOT</strong>, and <strong>Civilian</strong>.
                </p>
                <p>
                  Every listing features high-resolution previews, seller ratings, and instant deliverable verification.
                </p>
              </MintStep>

              <MintStep
                number={3}
                title="Publish Your First Asset or Bundle"
                badge="Creator Flow"
              >
                <div id="step-3" className="scroll-mt-24" />
                <p>
                  Ready to share your work? Open the <Link to="/sell" className="text-primary font-medium underline">Creator Studio</Link> and complete the 5-step listing wizard:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground my-3">
                  <li><strong>Type</strong>: Choose Single Item, Fleet Bundle, Free Giveaway, or Digital Code.</li>
                  <li><strong>Details</strong>: Add a title, description, department tags, and Robux price.</li>
                  <li><strong>Media</strong>: Upload high-res vehicle showcase photos or livery previews.</li>
                  <li><strong>Deliverables</strong>: Paste private Roblox Asset IDs or unlock tokens.</li>
                  <li><strong>Publish</strong>: Instant live activation on LibertyX!</li>
                </ol>

                <MintCodeTabs
                  tabs={[
                    {
                      title: "Deliverable Format",
                      language: "txt",
                      code: `ROBLOX_LIVERY_ID: rbxassetid://18294029104\nELS_CONFIG_STRING: [Pattern: Priority_Code3, Colors: Red/Blue, Flare: High]\nDISCORD_INVITE: ${BRAND.discordUrl}`,
                    },
                    {
                      title: "Webhook Event",
                      language: "json",
                      code: `{\n  "event": "listing.published",\n  "title": "2024 State Police Livery Pack",\n  "department": "Police",\n  "price": 150,\n  "marketplace": "LibertyX"\n}`,
                    },
                  ]}
                />
              </MintStep>

              <MintStep
                number={4}
                title="Automated Code Release & Scam-Shield"
                badge="Security"
              >
                <div id="step-4" className="scroll-mt-24" />
                <p>
                  Buyers receive immediate access to digital codes and Roblox asset strings once payment is confirmed. All deliverable assets are encrypted in escrow and released with automated receipt tracking.
                </p>
                <MintCallout type="warning" title="Keep Deliverables Secret">
                  Never paste your asset download links or Roblox IDs in the public description box. Put them exclusively in the <strong>Codes & Deliverables</strong> step.
                </MintCallout>
              </MintStep>
            </MintSteps>
          </div>

          <section id="next-steps" className="scroll-mt-24 mt-12">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Explore More Guides
            </h3>
            <MintCardGroup cols={3}>
              <MintCard
                title="Platform Overview"
                description="Learn about the LibertyX tech stack and ecosystem."
                icon={Sparkles}
                onClick={() => handleSelectPage("overview")}
              />
              <MintCard
                title="Selling Guide"
                description="Learn the 5-step listing workflow and pricing strategies."
                icon={UploadCloud}
                onClick={() => handleSelectPage("selling")}
              />
              <MintCard
                title="API Reference"
                description="Integrate LibertyX Marketplace into Discord bots."
                icon={Code2}
                onClick={() => handleSelectPage("api")}
              />
            </MintCardGroup>
          </section>
        </DocsLayout>
      )}

      {/* 2. OVERVIEW & FEATURES */}
      {currentPage === "overview" && (
        <DocsLayout
          title="Platform Overview & Features"
          badge="Architecture"
          description="Everything you need to know about LibertyX Marketplace features, escrow architecture, and creator tooling."
          readingTime="3 min read"
          currentPageId="overview"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Quickstart Guide", pageId: "quickstart" }}
          nextPage={{ label: "Account Setup & Auth", pageId: "account" }}
          toc={[
            { id: "pillars", label: "Core Features" },
            { id: "stack", label: "Technology & Performance" },
            { id: "community", label: "Community & Support" },
          ]}
        >
          <section id="pillars" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-4">Core Platform Features</h2>
            <MintCardGroup cols={2}>
              <MintCard
                title="Scam-Shield Escrow"
                description="Automated code release protects buyers and guarantees creator payouts."
                icon={ShieldCheck}
                onClick={() => handleSelectPage("scam-protection")}
                tag="Safety"
              />
              <MintCard
                title="Fleet Bundling"
                description="Package multiple vehicle liveries and uniforms into discounted department mega-packs."
                icon={Boxes}
                onClick={() => handleSelectPage("listing-types")}
                tag="Creators"
              />
              <MintCard
                title="Discord Webhooks"
                description="Real-time purchase notifications, role grants, and server feed integration."
                icon={Webhook}
                onClick={() => handleSelectPage("webhooks")}
                tag="Developer"
              />
              <MintCard
                title="Verified Creator Program"
                description="Gain verified status, higher search placement, and creator badge recognition."
                icon={UserCheck}
                onClick={() => handleSelectPage("verification")}
                tag="Trust"
              />
            </MintCardGroup>
          </section>

          <section id="stack" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Technology & Speed</h2>
            <p>LibertyX is built with a high-performance React + Vite frontend, Express API layer, and secure PostgreSQL transactional database to provide sub-100ms response times.</p>
          </section>

          <section id="community" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Community & Creators</h2>
            <p>Join over 500+ ER:LC creators sharing assets, trading tips, and collaborating on emergency services scenes.</p>
            <MintCallout type="tip" title="Join Discord">
              Join the official LibertyX Discord community at <a href={BRAND.discordUrl} target="_blank" rel="noreferrer" className="text-primary underline">{BRAND.discordUrl}</a> to chat with creators and staff.
            </MintCallout>
          </section>
        </DocsLayout>
      )}

      {/* 3. ACCOUNT SETUP & AUTH */}
      {currentPage === "account" && (
        <DocsLayout
          title="Account Setup & Authentication"
          badge="Getting Started"
          description="How to create an account, manage public profiles, link Discord credentials, and secure your seller dashboard."
          readingTime="3 min read"
          currentPageId="account"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Platform Overview", pageId: "overview" }}
          nextPage={{ label: "Selling Your First Asset", pageId: "selling" }}
          toc={[
            { id: "signup", label: "Registration & Login" },
            { id: "discord-oauth", label: "Discord OAuth Integration" },
            { id: "profile", label: "Customizing Your Profile" },
          ]}
        >
          <section id="signup" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">Registration & Login</h2>
            <p>You can create an account in seconds via email/password or using 1-click Discord authentication.</p>
            <MintSteps>
              <MintStep number={1} title="Navigate to Register">
                Click <Link to="/register" className="text-primary underline">Create Account</Link> or Sign In in the top right navigation bar.
              </MintStep>
              <MintStep number={2} title="Choose Your Creator Display Name">
                Your display name will appear on all your marketplace listings, customer reviews, and public profile.
              </MintStep>
              <MintStep number={3} title="Connect Roblox Username">
                Add your Roblox handle so buyers can identify your in-game group or workshop assets.
              </MintStep>
            </MintSteps>
          </section>

          <section id="discord-oauth" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Discord OAuth Integration</h2>
            <p>Connecting your Discord account enables direct DM notifications when someone purchases your listing or leaves a review.</p>
            <MintCallout type="note" title="Privacy Protection">
              We never post to Discord servers on your behalf or share your email address with third parties.
            </MintCallout>
          </section>
        </DocsLayout>
      )}

      {/* 4. SELLING YOUR FIRST ASSET */}
      {currentPage === "selling" && (
        <DocsLayout
          title="Selling Your First Asset"
          badge="Creator Guide"
          description="A complete guide on how to publish liveries, uniforms, ELS packs, and map templates on LibertyX Marketplace."
          readingTime="4 min read"
          currentPageId="selling"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Account Setup", pageId: "account" }}
          nextPage={{ label: "Listing Types & Bundles", pageId: "listing-types" }}
          toc={[
            { id: "wizard", label: "The 5-Step Listing Wizard" },
            { id: "pricing", label: "Pricing & Robux" },
            { id: "guidelines", label: "Asset Quality Guidelines" },
          ]}
        >
          <section id="wizard" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">The 5-Step Listing Wizard</h2>
            <p>Publishing on LibertyX takes less than 2 minutes. Head to the <Link to="/sell" className="text-primary font-medium underline">Sell Asset</Link> page to begin.</p>

            <MintSteps>
              <MintStep number={1} title="Choose Listing Type">
                Select whether your asset is a <strong>Single Item</strong>, <strong>Bundle</strong>, <strong>Free Giveaway</strong>, or <strong>Digital Code</strong>.
              </MintStep>
              <MintStep number={2} title="Provide Asset Details">
                Enter your title, catchy headline, comprehensive description, and assign department tags (e.g., Police, Fire, DOT).
              </MintStep>
              <MintStep number={3} title="Upload Media & Vehicle Previews">
                Add up to 10 high-resolution screenshots. Good lighting and in-game ER:LC showcase screenshots increase conversions by 40%.
              </MintStep>
              <MintStep number={4} title="Input Codes & Unlock Tokens">
                Provide private Roblox Asset IDs, Pastebin links, or Google Drive templates. These are safely encrypted until purchase.
              </MintStep>
              <MintStep number={5} title="Review and Launch">
                Review your pricing, accept the creator terms, and hit publish!
              </MintStep>
            </MintSteps>
          </section>

          <section id="pricing" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Pricing & Robux</h2>
            <p>You can offer your work completely free or charge Robux. Free items are featured in our community giveaway showcases.</p>
            <MintCallout type="tip" title="Competitive Pricing">
              Most individual vehicle liveries range between 50 - 150 Robux, while comprehensive department mega-bundles typically range between 300 - 800 Robux.
            </MintCallout>
          </section>

          <section id="guidelines" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Asset Quality Guidelines</h2>
            <ul className="space-y-2 text-sm text-muted-foreground my-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Original work only — no ripped or stolen decals.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Clear in-game ER:LC screenshots showcasing daylight view.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Accurate department tags and valid download links.</span>
              </li>
            </ul>
          </section>
        </DocsLayout>
      )}

      {/* 5. LISTING TYPES & BUNDLES */}
      {currentPage === "listing-types" && (
        <DocsLayout
          title="Listing Types & Formats"
          badge="Reference"
          description="Explore all supported listing formats: Single Assets, Multi-Pack Bundles, Community Giveaways, and Redeemable Codes."
          readingTime="3 min read"
          currentPageId="listing-types"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Selling Guide", pageId: "selling" }}
          nextPage={{ label: "Delivering Digital Codes", pageId: "codes" }}
          toc={[
            { id: "types-grid", label: "Listing Formats" },
            { id: "bundles", label: "Bundle Packages" },
            { id: "free", label: "Free Giveaways" },
          ]}
        >
          <section id="types-grid" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-4">Supported Formats</h2>
            <MintCardGroup cols={2}>
              <MintCard
                title="Single Asset"
                description="One standalone vehicle livery, uniform set, or ELS pattern configuration."
                icon={FileCheck}
                tag="Standard"
              />
              <MintCard
                title="Department Bundle"
                description="Comprehensive department fleet pack containing multiple vehicles and uniforms."
                icon={Boxes}
                tag="Best Value"
              />
              <MintCard
                title="Free Giveaway"
                description="Community asset offered for 0 Robux with instant one-click access."
                icon={Gift}
                tag="Free"
              />
              <MintCard
                title="Redeemable Code"
                description="Digital unlock code, VIP role token, or server template key."
                icon={KeyRound}
                tag="Digital"
              />
            </MintCardGroup>
          </section>

          <section id="bundles" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Creating Bundles</h2>
            <p>Bundles allow you to package a complete police department (e.g., Crown Victoria, Charger, Tahoe, Explorer) into a single discounted product page.</p>
          </section>
        </DocsLayout>
      )}

      {/* 6. DELIVERING DIGITAL CODES */}
      {currentPage === "codes" && (
        <DocsLayout
          title="Delivering Digital Codes & Assets"
          badge="Deliverables"
          description="Best practices for delivering Roblox Asset IDs, Pastebin scripts, Drive links, and Discord server invite tokens."
          readingTime="3 min read"
          currentPageId="codes"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Listing Types", pageId: "listing-types" }}
          nextPage={{ label: "Scam-Shield Escrow", pageId: "scam-protection" }}
          toc={[
            { id: "formats", label: "Supported Deliverable Formats" },
            { id: "security", label: "Delivery Security" },
          ]}
        >
          <section id="formats" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">Deliverable Formats</h2>
            <p>LibertyX supports multiple deliverable formats that are automatically decrypted and shown to the buyer upon checkout:</p>
            
            <MintCodeTabs
              tabs={[
                {
                  title: "Roblox Asset ID",
                  language: "txt",
                  code: `rbxassetid://18492049102\nDecal Name: State Trooper 2024 Side Doors`,
                },
                {
                  title: "Google Drive / Link",
                  language: "txt",
                  code: `https://drive.google.com/file/d/1X9_EXAMPLE/view?usp=sharing\nPassword: LibertyX-Pack-2026`,
                },
                {
                  title: "ELS Configuration",
                  language: "json",
                  code: `{\n  "preset": "Code3_State_Trooper",\n  "lightbar": "Valor",\n  "siren": "Whelen_295",\n  "colors": ["red", "blue"]\n}`,
                },
              ]}
            />
          </section>

          <section id="security" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Security & Storage</h2>
            <MintCallout type="tip" title="Instant Access Guarantee">
              Deliverable codes are permanently saved in the buyer's private order history on their LibertyX Dashboard.
            </MintCallout>
          </section>
        </DocsLayout>
      )}

      {/* 7. SCAM-SHIELD ESCROW */}
      {currentPage === "scam-protection" && (
        <DocsLayout
          title="Scam-Shield & Escrow Protection"
          badge="Security"
          description="How LibertyX Marketplace protects creators and buyers with automated code escrow and transaction safety."
          readingTime="2 min read"
          currentPageId="scam-protection"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Delivering Codes", pageId: "codes" }}
          nextPage={{ label: "Roblox ID Verification", pageId: "verification" }}
          toc={[
            { id: "how-it-works", label: "How Scam-Shield Works" },
            { id: "escrow", label: "Escrow Code Release" },
            { id: "disputes", label: "Dispute Handling" },
          ]}
        >
          <section id="how-it-works" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">How Scam-Shield Works</h2>
            <p>LibertyX Marketplace guarantees that buyers receive legitimate assets and creators receive proper compensation without intermediary risk.</p>

            <MintCallout type="tip" title="Verified Creator Badges">
              Creators with 10+ positive verified transactions receive the <strong>Verified Creator</strong> badge across all listings.
            </MintCallout>
          </section>

          <section id="escrow" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Escrow Code Release</h2>
            <p>Deliverable codes and Roblox asset strings are never exposed publicly. They are released only upon successful confirmation of checkout.</p>
          </section>
        </DocsLayout>
      )}

      {/* 8. ROBLOX ID VERIFICATION */}
      {currentPage === "verification" && (
        <DocsLayout
          title="Roblox ID Verification"
          badge="Identity"
          description="Verify your Roblox profile to earn verified seller badges and unlock automated asset delivery."
          readingTime="2 min read"
          currentPageId="verification"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Scam-Shield Escrow", pageId: "scam-protection" }}
          nextPage={{ label: "REST API Reference", pageId: "api" }}
          toc={[
            { id: "process", label: "Verification Process" },
            { id: "benefits", label: "Badge Benefits" },
          ]}
        >
          <section id="process" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">Verification Process</h2>
            <p>We verify Roblox ownership through official game place codes or bio phrase confirmation.</p>
            <MintSteps>
              <MintStep number={1} title="Enter Roblox Username">
                Navigate to your <Link to="/dashboard" className="text-primary underline">Dashboard</Link> and enter your exact Roblox handle.
              </MintStep>
              <MintStep number={2} title="Generate Verification Token">
                Our system creates a temporary security phrase like <code>LibertyX-Verify-8829</code>.
              </MintStep>
              <MintStep number={3} title="Paste in Roblox About Bio">
                Paste the code into your Roblox bio for 60 seconds and click Confirm.
              </MintStep>
            </MintSteps>
          </section>
        </DocsLayout>
      )}

      {/* 9. REST API REFERENCE */}
      {currentPage === "api" && (
        <DocsLayout
          title="REST API & Developer Integration"
          badge="Developers"
          description="Programmatically fetch marketplace listings, verify player inventory, and listen to real-time webhook events."
          readingTime="4 min read"
          currentPageId="api"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "Roblox Verification", pageId: "verification" }}
          nextPage={{ label: "Discord Bot Webhooks", pageId: "webhooks" }}
          toc={[
            { id: "base-url", label: "Base URL & Authentication" },
            { id: "listings-api", label: "GET /api/listings" },
            { id: "health-api", label: "GET /api/healthz" },
          ]}
        >
          <section id="base-url" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">Base URL</h2>
            <p>All API endpoints are served over HTTPS and return structured JSON payloads.</p>

            <MintCodeTabs
              tabs={[
                {
                  title: "Base URL",
                  language: "http",
                  code: `https://libertymarketplace.com/api`,
                },
                {
                  title: "cURL",
                  language: "bash",
                  code: `curl -X GET "http://localhost:5000/api/listings" \\\n  -H "Accept: application/json"`,
                },
                {
                  title: "JavaScript / TypeScript",
                  language: "typescript",
                  code: `const res = await fetch('/api/listings?department=police');\nconst data = await res.json();\nconsole.log(data);`,
                },
                {
                  title: "Python",
                  language: "python",
                  code: `import requests\n\nresponse = requests.get('https://libertymarketplace.com/api/listings')\nlistings = response.json()\nprint(f"Found {len(listings)} listings")`,
                },
              ]}
            />
          </section>

          <section id="listings-api" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">GET /api/listings</h2>
            <p>Returns a paginated list of active marketplace listings with creator metadata and pricing.</p>
            <MintCallout type="info" title="Public Endpoint">
              The `/api/listings` endpoint is publicly accessible without API keys for read-only directory indexing.
            </MintCallout>
          </section>

          <section id="health-api" className="scroll-mt-24 mt-8">
            <h2 className="text-xl font-bold text-foreground mb-3">GET /api/healthz</h2>
            <p>Returns health status for load balancers and uptime monitoring.</p>
            <MintCodeTabs
              code={`{\n  "status": "ok",\n  "uptime": "99.98%",\n  "timestamp": "2026-08-24T20:00:00Z"\n}`}
              language="json"
              filename="Health Check Response"
            />
          </section>
        </DocsLayout>
      )}

      {/* 10. DISCORD BOT WEBHOOKS */}
      {currentPage === "webhooks" && (
        <DocsLayout
          title="Discord Bot Webhooks"
          badge="Integration"
          description="Send real-time alerts to your community Discord server when you publish a new asset or receive a purchase."
          readingTime="3 min read"
          currentPageId="webhooks"
          onSelectPage={handleSelectPage}
          prevPage={{ label: "REST API Reference", pageId: "api" }}
          toc={[
            { id: "setup", label: "Webhook Configuration" },
            { id: "events", label: "Supported Events" },
          ]}
        >
          <section id="setup" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground mb-3">Webhook Configuration</h2>
            <p>Paste your Discord Channel Webhook URL in your Creator Settings to broadcast live drops directly to your server.</p>

            <MintCodeTabs
              filename="Discord Webhook Payload"
              language="json"
              code={`{\n  "username": "LibertyX Drops",\n  "embeds": [{\n    "title": "🚨 New Drop: 2024 State Police Livery Pack",\n    "description": "Created by StatePatrolDev • 150 Robux",\n    "color": 2539642,\n    "url": "https://libertymarketplace.com/listing/123",\n    "footer": { "text": "LibertyX Marketplace" }\n  }]\n}`}
            />
          </section>
        </DocsLayout>
      )}
    </>
  );
}
