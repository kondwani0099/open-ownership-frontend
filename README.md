# Submission & Approval Workflow — Frontend

Vue 3 + Vite frontend for the submission and approval workflow.
Design follows the Uniplexity design system (monospace, brutalist, border-based).

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies API requests to `http://localhost:8000`.

### Prerequisites
- Node.js 18+
- Backend running (see `open-ownership-backend/README.md`)

## Pages

| Route                  | Role       | Description                                      |
|------------------------|------------|--------------------------------------------------|
| `/login`               | Guest      | Login form with demo credential quick-fill       |
| `/applicant`           | Applicant  | My applications list, create/edit draft, submit  |
| `/reviewer`            | Reviewer   | Queue with filters, search, review actions       |
| `/applications/:id`    | Both       | Detail view with full audit trail + actions      |

## Features

### Applicant Dashboard
- KPI cards (total, drafts, submitted, decided)
- Filter by status
- Create new application (modal form with validation)
- Edit draft applications
- Submit for review
- View detail with audit trail

### Reviewer Queue
- KPI cards (queue, pending, in review, decided)
- Filter by status + full-text search
- Quick "Take Review" button
- Review modal with approve/reject/return actions
- Comment required on reject/return
- Pagination

### Application Detail
- Full application information
- Status badge with color coding
- Reviewer actions (context-sensitive based on current status)
- Full audit trail timeline with who, when, old->new status, comments
- Submit button for applicants (DRAFT only)

### Design System
- Monospace fonts (Courier New / Consolas)
- Uppercase labels with tracking-widest
- Minimal color palette: blue (applicant), emerald (reviewer), gray (neutral)
- Border-based card design (no rounded corners)
- Status badges with semantic colors

## Project Structure

```
src/
├── api_services/
│   └── api.js          # Axios instance, interceptors, API functions
├── router/
│   └── index.js        # Vue Router with role-based guards
├── views/
│   ├── LoginPage.vue
│   ├── ApplicantDashboard.vue
│   ├── ReviewerQueue.vue
│   └── ApplicationDetail.vue
├── App.vue
├── main.js
└── style.css
```

## Trade-offs
- No Pinia/Vuex store — the app is small enough that local component state + onMounted fetch is sufficient.
- No form library — native HTML validation + manual error state is adequate for this scale.
- Font Awesome CDN for icons — avoids bundling the full FA library.
- No TypeScript — the existing UB frontend uses JS; adding TS would be a separate migration.