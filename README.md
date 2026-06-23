# Submission & Approval Workflow — Frontend

Vue 3 + Vite frontend for the submission and approval workflow.
Modern SaaS design with Poppins font, glass-morphism headers, and rounded UI.

**Live App:** `https://open-ownership-frontend.vercel.app`

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` (auto-increments if port is busy)  
and proxies API requests to `http://localhost:8000`.

### Prerequisites
- Node.js 18+
- Backend running (see `open-ownership-backend/README.md`)

### Full Local Setup (both ends)

```bash
# Terminal 1 — Backend
cd open-ownership-backend
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Frontend
cd open-ownership-frontend
npm install
npm run dev
```

Then open `http://localhost:5173` and sign in with `demo@applicant.com` / `password123`.

## Pages

| Route                  | Role       | Description                                        |
|------------------------|------------|----------------------------------------------------|
| `/`                    | Public     | Landing page with hero, features, CTA              |
| `/login`               | Guest      | Two-column login with image panel + demo quick-fill|
| `/signup`              | Guest      | Registration with role selection                   |
| `/applicant`           | Applicant  | Dashboard with KPIs, CRUD, pagination, delete       |
| `/reviewer`            | Reviewer   | Queue with search/filter, review actions, delete    |
| `/applications/:id`    | Both       | Detail view with full audit trail + actions         |

## Features

### Landing Page
- Modern SaaS hero with gradient background, floating metric cards
- "Now accepting applications" pulsing badge
- Feature cards grid, numbered how-it-works steps
- Benefits section with dark dashboard card
- Responsive — stacks vertically on mobile

### Applicant Dashboard
- KPI cards (total, drafts, submitted, decided)
- Filter by status, pagination (10 per page)
- Create/edit modal with validation
- Submit with custom confirmation modal
- Delete (DRAFT only) with custom confirmation modal
- Notification bell with dropdown

### Reviewer Queue
- KPI cards (total, pending, in review, decided)
- Full-text search + status filter
- Review modal with approve/reject/return actions
- Comment required on reject/return
- Delete any application
- Pagination (25 per page)

### Application Detail
- Two-column layout (details + audit trail)
- Status badge with semantic colors
- Context-sensitive reviewer actions
- Full audit trail timeline

### Design System
- **Poppins** font (Google Fonts, weights 300–900)
- **Tailwind CSS CDN** with custom brand palette (`#2F2E8B`)
- Glass-morphism headers (`backdrop-blur-xl`)
- Rounded-2xl cards, rounded-xl inputs
- Brand-colored status pills
- Custom confirmation/success/error modals (ActionModal)

## Project Structure

```
src/
├── api_services/
│   └── api.js              # Axios instance, interceptors, all API functions
├── components/
│   ├── AppLogo.vue          # Logo with dark mode support
│   ├── NotificationBell.vue # Bell icon + dropdown + polling
│   └── ActionModal.vue      # Reusable confirm/success/error modal
├── router/
│   └── index.js             # Vue Router with role-based guards
├── views/
│   ├── LandingPage.vue      # Public landing page
│   ├── LoginPage.vue        # Two-column login
│   ├── SignupPage.vue       # Two-column registration
│   ├── ApplicantDashboard.vue
│   ├── ReviewerQueue.vue
│   └── ApplicationDetail.vue
├── assets/
│   └── logo.png             # App logo
├── App.vue
├── main.js
└── style.css                # Global styles + mesh background
```

## Trade-offs
- **No Pinia/Vuex** — component state + onMounted fetch is sufficient for this scope.
- **Tailwind CDN** (not PostCSS build) — faster iteration, but shows dev warning. Production build uses PostCSS.
- **Font Awesome CDN** — avoids bundling the full icon library.
- **No TypeScript** — keeping consistent with the existing UB frontend; migrating to TS would be a separate effort.

## Deployment

### Docker

```bash
# Build and run
docker build -t open-ownership-frontend .
docker run -p 3000:3000 open-ownership-frontend
```

The multi-stage Dockerfile:
- **Build stage** — installs deps, runs `npm run build`
- **Production stage** — copies `dist/` + `server.js`, installs only production deps
- Uses Node 24 Alpine
- Serves on port 3000 via Express with gzip compression, security headers, SPA fallback

### Vercel (Production)

Hosted on **Vercel** with auto-deploys on push to `main`:
- Frontend: `https://open-ownership-frontend.vercel.app`
- Serves built static files via Express (`server.js`)
- SPA fallback for client-side routing

### GitHub Actions CI/CD

On every push/PR to `main`:

| Job       | What it does                                              |
|-----------|-----------------------------------------------------------|
| **build** | Installs deps, runs `npm run build`, uploads artifact     |
| **deploy**| Deploys to Vercel (production, on push to main only)      |

Workflow: `.github/workflows/frontend.yml`  
Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_FRONTEND_PROJECT_ID`

## AI Usage

| Tool               | Used For                                                    |
|--------------------|-------------------------------------------------------------|
| **GitHub Copilot** | Code generation, autocomplete, refactoring across all files |
| **DeepSeek V4 Pro**| Architecture planning, component structure, state management|
| **Claude Opus 4.6**| UI/UX design system, responsive layout, visual polish       |
| **Gemini Nano**    | Image generation (logo, office hero image)                  |
| **Vercel**         | DevOps — hosting frontend and backend                       |

All AI-generated code was reviewed, tested, and refined.