# CampusConnect

A College Club & Event Management System (Frontend Prototype). Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## 📁 Frontend Structure

- `src/app/`: Next.js App Router structure.
  - `(dashboard)/`: Route groups containing layout wrappers for authenticated roles.
    - `admin/`: Admin portal pages.
    - `coordinator/`: Club Coordinator portal pages.
    - `student/`: Student portal pages.
  - `design/`: A kitchen-sink Design System page displaying all UI components.
  - `demo/`: A role-switcher page to test the application flows.
- `src/components/`:
  - `layout/`: Shared structural components (`DashboardLayout`, `PublicLayout`).
  - `ui/`: Reusable, atomic design components (`Button`, `Card`, `Badge`, `Modal`, `Tabs`, `Table`).
- `src/mock-data/`: Hardcoded JSON/TypeScript arrays serving as the static backend. It contains system-wide mock data seeded with realistic names, dates, and relationships.
- `src/services/api.ts`: A mock API wrapper. All components call these functions instead of importing mock data directly, ensuring seamless migration to a real backend.
- `src/types/`: Shared TypeScript interfaces mapping the future database schema.

## 🚀 How to Run Locally

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)
4. Navigate to **http://localhost:3000/demo** to instantly switch between Student, Coordinator, and Admin views.

## 🔌 Integrating a Backend (Future Phase)

Currently, the app relies entirely on local mock data mutated in-memory. To transition to a real backend:
1. Swap the mock data imports in `src/services/api.ts` with real `fetch()` calls or a data-fetching library (like SWR or React Query).
2. Set up Next.js API Routes (`src/app/api/...`) or an external backend (Express, NestJS, Go, etc.).
3. Implement real JWT authentication and remove the `/demo` manual role picker.
4. Replace local state mutations (e.g., `mockRegistrations.push()`) with `POST`/`PUT` requests.
