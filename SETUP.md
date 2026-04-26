# QUICK SETUP CHEAT SHEET - La Bistro

## ONE-TIME SETUP (First time only)

### Terminal 1: Database

```bash
# PostgreSQL - Create database
createdb la_bistro_db

# Or via psql:
psql -U postgres
# Then: CREATE DATABASE la_bistro_db;
```

### Terminal 2: Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
# Wait for: "🚀 La Bistro server running on http://localhost:5000"
```

### Terminal 3: Frontend

```bash
cd frontend
npm install
npm run dev
# Wait for: "Local: http://localhost:5173/"
```

Then open browser: **http://localhost:5173**

---

## EVERY TIME YOU RUN THE PROJECT

**Terminal 1: Backend**
```bash
cd backend
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173`

---

## FILES CREATED ✅

### Backend Core
- `backend/src/index.ts` - Express server setup
- `backend/src/middleware/auth.ts` - JWT authentication
- `backend/src/middleware/upload.ts` - Multer file upload
- `backend/prisma/schema.prisma` - Database schema
- `backend/package.json` - Dependencies
- `backend/.env` - Environment variables (FILL THIS IN)
- `backend/.env.example` - Template

### Backend Routes (Stubs ready)
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/menu.routes.ts`
- `backend/src/routes/category.routes.ts`
- `backend/src/routes/reservation.routes.ts`
- `backend/src/routes/gallery.routes.ts`
- `backend/src/routes/restaurant.routes.ts`
- `backend/src/routes/content.routes.ts`

### Frontend Core
- `frontend/src/main.tsx` - React entry point
- `frontend/src/App.tsx` - Routes and layout
- `frontend/src/index.css` - Tailwind setup
- `frontend/src/services/api.ts` - Axios client
- `frontend/package.json` - Dependencies
- `frontend/.env.local` - Environment variables (FILL THIS IN)
- `frontend/vite.config.ts` - Vite configuration

### Frontend Redux Store
- `frontend/src/store/store.ts` - Redux store config
- `frontend/src/store/slices/authSlice.ts` - Auth state
- `frontend/src/store/slices/menuSlice.ts` - Menu state
- `frontend/src/store/slices/restaurantSlice.ts` - Restaurant info state

### Frontend Components
- `frontend/src/components/common/Navbar.tsx` - Navigation
- `frontend/src/components/common/Footer.tsx` - Footer

---

## WHAT STILL NEEDS CODE

1. **Backend Controllers** - Business logic for each route
2. **Backend Services** - Database operations
3. **Backend Validators** - Input validation
4. **Frontend Pages** - Home, Menu, Gallery, Admin pages
5. **Frontend Components** - Forms, cards, modals
6. **Database Seeding** - Initial admin user + sample data

---

## DEFAULT CREDENTIALS (After seeding)

```
Email: admin@labistro.com
Password: Admin@123
```

*(These will be created in the seed file)*

---

## API BASE URL

Backend: `http://localhost:5000`
API: `http://localhost:5000/api`
Frontend: `http://localhost:5173`

---

## KEY FEATURES

✅ **Done:**
- Project structure
- TypeScript configuration
- Express + Prisma setup
- Redux store setup
- Database schema
- Route stubs
- Frontend routing
- Navbar & Footer
- Axios API client with JWT interceptor

🔲 **Todo:**
- Auth implementation (login, verify)
- Menu CRUD operations
- Category management
- Reservation system
- Gallery management
- Restaurant info management
- Admin pages
- Form validations
- Error handling
- Email notifications

---

## TROUBLESHOOTING QUICK FIXES

| Error | Solution |
|-------|----------|
| Port 5000 in use | Change `PORT=5001` in `.env` |
| Port 5173 in use | Will auto-increment or change in `vite.config.ts` |
| DB connection failed | Check `DATABASE_URL` in `.env` |
| "Cannot find module" | Run `npm install` in the directory |
| Prisma errors | Run `npm run prisma:generate` |
| CORS errors | Check `CORS_ORIGIN` in backend `.env` |

---

**Next: Run the setup commands above! 🚀**
