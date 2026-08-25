# LibertyX — ER:LC Asset Marketplace & Creator Ecosystem

<p align="center">
  <img src="artifacts/testaa-preview/src/assets/logo.png" alt="LibertyX" width="120" onerror="this.style.display='none'"/>
</p>

<p align="center">
  <b>The modern, futuristic marketplace and creator platform for Emergency Response: Liberty County.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9"/>
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7"/>
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4"/>
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 24"/>
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License"/>
</p>

---

## 🌟 Overview

**LibertyX** is a production-grade digital marketplace and community hub designed specifically for ER:LC creators and roleplay communities. It provides a seamless platform for discovering, purchasing, and publishing high-quality liveries, uniforms, vehicle packages, scripts, and server templates.

Built with a unified dark aesthetic (`#090A0F` canvas, `#12151E` cards, and `#10B981` emerald accents), LibertyX delivers a clean, compact, and responsive user experience across desktop and mobile devices.

---

## ✨ Features

- 🛒 **ER:LC Marketplace** — Search and filter assets by emergency departments (Police, Sheriff, Fire/EMS, DOT, Security, Civilian) and item categories.
- 🎨 **Creator Storefronts & Profiles** — Personalized `/u/:username` public pages with custom bios, verified badges, showcases, and customer reviews.
- 🛠️ **Creator Studio / Dashboard** — Comprehensive portal for creators to track sales metrics, manage listings, view orders, and manage customer feedback.
- 📦 **Multi-Step Asset Publishing Wizard** — Drag-and-drop media uploader, live preview card, tag support, and instant code delivery options.
- 🔗 **Listing Sharing** — Instant cross-session sharing via encoded URLs so buyers and collaborators can view and import listings effortlessly.
- 💬 **Buyer & Seller Messaging** — Two-panel chat system with contextual product attachments and real-time alerts.
- 🖥️ **Community Hosting** — Managed hosting dashboard for ER:LC community bots and services ($12.99/mo) with live status and power controls.
- 🛡️ **Admin & Moderation Panel** — Role-gated panel for staff and server owners (`eazykims`) with incident management and audit logging.
- 📊 **Real-Time System Status** — Live service health indicators and incident tracking.
- 🚫 **Zero Fake Data Policy** — All listings, creators, reviews, and metrics come from real database entries or render clean empty states.

---

## 📁 Repository Structure

```text
├── artifacts/
│   ├── testaa-preview/          # Primary React 19 + Vite frontend application
│   │   ├── src/
│   │   │   ├── components/      # Shared UI primitives, cards, headers, navigation & layouts
│   │   │   ├── hooks/           # Custom React hooks (useMobile, useToast)
│   │   │   ├── lib/             # Database layer, auth context, design tokens & utilities
│   │   │   └── pages/           # All application routes (Marketplace, Studio, Profile, etc.)
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── api-server/              # Express 5 backend API
│   │   ├── src/
│   │   └── package.json
│   └── mockup-sandbox/          # Isolated component preview sandbox
├── lib/
│   ├── api-client-react/        # Generated React Query hooks for API
│   ├── api-spec/                # OpenAPI specification and codegen tools
│   ├── api-zod/                 # Zod validation schemas
│   └── db/                      # Drizzle ORM schema & database migrations
├── scripts/                     # Workspace maintenance and build scripts
├── pnpm-workspace.yaml          # Monorepo configuration
├── tsconfig.base.json           # Shared TypeScript configuration
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 🚀 Quickstart

### Prerequisites

- **Node.js** `>= 20.0.0` (Node 24 recommended)
- **pnpm** `>= 9.0.0` (`npm install -g pnpm`)

### 1. Clone & Install

```bash
git clone https://github.com/hostinglumora-cyber/zip-repl-1.git
cd zip-repl-1

# Install monorepo dependencies
pnpm install
```

### 2. Run the Development Server

To run the main LibertyX website:

```bash
# Set environment variables and start Vite dev server
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/testaa-preview run dev
```

The application will be available at `http://localhost:5173`.

### 3. Run the API Server (Optional)

```bash
pnpm --filter @workspace/api-server run dev
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `pnpm --filter @workspace/testaa-preview run dev` | Start the LibertyX frontend development server |
| `pnpm --filter @workspace/testaa-preview run build` | Build the frontend for production |
| `pnpm --filter @workspace/api-server run dev` | Start the backend Express API server |
| `pnpm run typecheck` | Run typechecking across all workspace packages |
| `pnpm run build` | Build all workspace packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate TypeScript API hooks and schemas |
| `pnpm --filter @workspace/db run push` | Push Drizzle ORM schema updates to Postgres |

---

## 🎨 Design System

LibertyX uses a custom, compact dark design system defined in [`src/lib/design-tokens.ts`](artifacts/testaa-preview/src/lib/design-tokens.ts):

- **Background Canvas:** `#090A0F`
- **Surface Level 1:** `#12151E`
- **Surface Level 2:** `#1C212E`
- **Accent Emerald:** `#10B981` (hover: `#34D399`, dark: `#059669`)
- **Border Outline:** `rgba(255, 255, 255, 0.08)`
- **Typography:** Inter (`text-slate-50` primary, `text-slate-400` secondary, `text-slate-500` muted)

---

## 🔒 Security & Roles

- **Owner:** Permanent owner privileges assigned to `@eazykims`.
- **Discord OAuth:** Seamless community login via Discord.
- **Roblox Verification:** Integrated verification badge linking for authenticated creators.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
