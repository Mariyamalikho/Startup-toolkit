# Startup Toolkit

> An all-in-one venture ideation, validation, and strategy workspace built for early-stage founders, startup teams, and product builders.

Built by **Mariyam Ali K.** ([@Mariyamalikho](https://github.com/Mariyamalikho))

---

## Overview

**Startup Toolkit** brings essential lean startup frameworks into a unified, interconnected workspace. Instead of scattering customer discovery notes, business model canvases, validation experiments, and investor pitch decks across disconnected documents, founders can ideate, validate, and export investor-ready deliverables in one place.

---

## Core Features

- **Venture Dashboard**: Manage multiple startup ventures with real-time search, industry/status filtering, and progress tracking.
- **Freeform Brainstorming Board**: Capture early ideas on a flexible sticky-note board with category tags and color coding.
- **Empathy Map Canvas**: Map customer personas across _Thinks & Feels_, _Sees_, _Hears_, _Says & Does_, _Pains_, and _Gains_.
- **9-Box Business Model Canvas**: Interactive drag-and-drop canvas covering Value Propositions, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partners, and Cost Structure.
- **AI Problem & Value Proposition Co-Pilot**: Generate structured problem statements and value propositions and sync them directly into your Empathy Map and Business Model Canvas.
- **Lean Experiment Tracker**: Formulate testable hypotheses, define success metrics, and track validation outcomes.
- **Prototype Roadmap & Milestone Timeline**: Plan product milestones and deliverables across a 6-month execution horizon.
- **Investor Pitch Deck Generator**: Automatically synthesize canvas insights into a 10-slide investor deck with customizable presentation themes and fullscreen presenter mode.
- **Client-Side PDF Export Engine**: Export structured venture reports and canvases to print-ready PDF documents.
- **Cloud Autosave & Offline Resilience**: Debounced real-time synchronization with Supabase PostgreSQL, backed by exponential retry handling and local storage fallback.
- **Adaptive Light & Dark Theme System**: High-contrast dark and light modes persisted across sessions.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling & Motion**: Tailwind CSS v4, Framer Motion, Lucide Icons, Class Variance Authority
- **State Management**: Zustand
- **Routing**: React Router v7 (code-split lazy routes)
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Supabase** project (optional — the app includes an automatic local storage fallback when Supabase environment variables are not configured)

### 1. Clone the repository

```bash
git clone https://github.com/Mariyamalikho/Startup-toolkit.git
cd Startup-toolkit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and add your Supabase project credentials:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

To initialize the database tables and Row Level Security policies, run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```text
├── public/                 # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication forms & modals
│   │   ├── dashboard/      # Venture cards, grid/list views & modals
│   │   ├── export/         # Printable venture report & PDF export modal
│   │   ├── layout/         # AppLayout, Navbar & collapsible Sidebar
│   │   ├── navigation/     # Methodology stepper ribbon
│   │   ├── pitch/          # Investor pitch deck generator & presenter
│   │   ├── tools/          # AI Problem & Value Proposition Co-Pilot
│   │   ├── ui/             # Atomic design system primitives
│   │   └── workspace/      # Canvases, sticky notes, experiments & roadmap
│   ├── context/            # Supabase AuthContext provider
│   ├── hooks/              # Autosave, drag-and-drop, filtering, theme & sync hooks
│   ├── lib/                # Supabase client, PDF exporter & retry utilities
│   ├── pages/              # Route-level page views
│   ├── routes/             # Lazy-loaded application routes & route guards
│   ├── services/           # Supabase CRUD service wrappers
│   ├── store/              # Zustand project & toast stores
│   └── types/              # TypeScript interfaces & database schema types
├── supabase/
│   └── schema.sql          # PostgreSQL tables, triggers & RLS policies
└── vercel.json             # SPA rewrite rules for production deployment
```

---

## License

This project is licensed under the [MIT License](LICENSE).
