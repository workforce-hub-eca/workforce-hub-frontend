# WorkForceHub - Frontend 🚀

The modern, responsive user interface for the WorkForceHub microservices system.

## 🛠️ Tech Stack
- **React**: 19.2.8
- **Vite**: 8.2.0
- **Styling**: Tailwind CSS 4.3.3
- **Animations**: Framer Motion
- **State & Data**: TanStack React Query & Axios
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Sonner (Toasts) & Lucide React (Icons)

## ✨ Architecture Highlights
- Uses a sleek 'Dark White' and 'Emerald Green' premium theme.
- All forms enforce strict Zod validation with 10MB limits on file uploads.
- Communicates seamlessly with the backend API Gateway at `http://localhost:8080/api/v1`.
- Fully integrated with strict loading states to ensure resilience against microservice latency.

## 🚀 Running Locally
```bash
npm install
npm run dev
```
Runs locally on `http://localhost:5173`.
