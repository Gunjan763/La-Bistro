# La Bistro Restaurant Website

A full-stack restaurant website with public menu, reservations, gallery, and admin panel.

**Stack:**
- Frontend: React + TypeScript + Vite + Tailwind CSS + Redux
- Backend: Node.js + Express + TypeScript + Prisma ORM
- Database: PostgreSQL
- Auth: JWT (admin only)
- File Uploads: Multer

---

## QUICK START GUIDE

### Prerequisites

Ensure you have installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **npm** 9+ (comes with Node.js)

---

## STEP 1: Database Setup

### 1a. Create PostgreSQL Database

Open your PostgreSQL client (pgAdmin, DBeaver, or psql CLI) and run:

```sql
CREATE DATABASE la_bistro_db;
```

Or via terminal (macOS/Linux):
```bash
createdb la_bistro_db
```

Or via PowerShell (Windows):
```powershell
psql -U postgres -c "CREATE DATABASE la_bistro_db;"
```

### 1b. Configure Database Connection

In `backend/.env`, set:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/la_bistro_db
```

Replace `yourpassword` with your PostgreSQL password.

---

## STEP 2: Backend Setup

### 2a. Navigate to Backend Directory

```bash
cd backend
```

### 2b. Install Dependencies

```bash
npm install
```

### 2c. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2d. Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted, give your migration a name (e.g., "init").

### 2e. Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 La Bistro server running on http://localhost:5000
```

**Backend is now running on:** `http://localhost:5000`

---

## STEP 3: Frontend Setup

### 3a. Open New Terminal and Navigate to Frontend

```bash
cd frontend
```

### 3b. Install Dependencies

```bash
npm install
```

### 3c. Start Frontend Dev Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
```

**Frontend is now running on:** `http://localhost:5173`

---

## STEP 4: Test the Setup

### 4a. Open Browser

Navigate to: `http://localhost:5173`

You should see:
- La Bistro navigation bar (Home, Menu, Gallery, etc.)
- Admin login link in top-right

### 4b. Test API Health Check

In a new terminal, run:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok"
}
```

---

## Project Structure

```
Restaurant/
├── backend/
│   ├── src/
│   │   ├── index.ts                 (Main server)
│   │   ├── middleware/
│   │   │   ├── auth.ts              (JWT middleware)
│   │   │   └── upload.ts            (Multer config)
│   │   ├── routes/                  (API endpoints)
│   │   ├── controllers/             (Route handlers)
│   │   ├── services/                (Business logic)
│   │   ├── validators/              (Input validation)
│   │   └── utils/                   (Helper functions)
│   ├── prisma/
│   │   ├── schema.prisma            (Database schema)
│   │   └── migrations/              (Auto-generated)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                         (Create from .env.example)
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 (Entry point)
│   │   ├── App.tsx                  (Routes & layout)
│   │   ├── store/                   (Redux store)
│   │   │   ├── store.ts             (Store config)
│   │   │   └── slices/              (Redux slices)
│   │   ├── services/
│   │   │   └── api.ts               (Axios API client)
│   │   ├── components/
│   │   │   ├── common/              (Navbar, Footer)
│   │   │   └── ...
│   │   └── pages/                   (Page components)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local                   (Create from .env.example)
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## Available Commands

### Backend

```bash
npm run dev              # Start dev server with hot reload
npm run build           # Compile TypeScript to JavaScript
npm run start           # Run compiled version
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Create/apply migrations
npm run prisma:seed     # Run seed data (future)
npm run prisma:studio   # Open Prisma Studio GUI
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## Troubleshooting

### "Port 5000 is already in use"

**Solution:** Kill the process or change PORT in `.env`:
```env
PORT=5001
```

### "Port 5173 is already in use"

**Solution:** Vite will auto-increment to 5174, or change in `vite.config.ts`:
```ts
server: {
  port: 5174,
}
```

### "Database connection refused"

**Check:**
1. PostgreSQL is running: `psql --version`
2. Database exists: `psql -l` (list databases)
3. CONNECTION string is correct in `.env`
4. Username/password are correct

### "Module not found errors"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Prisma migration errors"

**Solution:**
```bash
# Reset database (warning: loses data)
npx prisma migrate reset

# Or manually drop and recreate
psql -U postgres -c "DROP DATABASE la_bistro_db;"
psql -U postgres -c "CREATE DATABASE la_bistro_db;"
npm run prisma:migrate
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/la_bistro_db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-32-chars-min` |
| `JWT_EXPIRY` | Token expiration | `7d` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Upload limit (bytes) | `10485760` (10MB) |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps API key (optional) | `AIza...` |

---

## Next Steps

After setup is complete:

1. **Create Admin User**: Implement `/api/auth/login` endpoint
2. **Build Controllers**: Add business logic for each route
3. **Build Components**: Create React pages and forms
4. **Connect Frontend to Backend**: Use Redux + axios services
5. **Add Features**: Menu management, reservations, gallery, etc.

---

## API Endpoints (Ready to implement)

### Authentication
```
POST   /api/auth/login          - Admin login
POST   /api/auth/verify         - Verify JWT token
```

### Menu
```
GET    /api/menu/items          - List all menu items
GET    /api/menu/items/:id      - Get single item
POST   /api/menu/items          - Create item (admin)
PUT    /api/menu/items/:id      - Update item (admin)
DELETE /api/menu/items/:id      - Delete item (admin)
```

### Categories
```
GET    /api/categories          - List categories
POST   /api/categories          - Create category (admin)
PUT    /api/categories/:id      - Update category (admin)
DELETE /api/categories/:id      - Delete category (admin)
```

### Reservations
```
POST   /api/reservations        - Make reservation
GET    /api/reservations        - List all (admin)
PUT    /api/reservations/:id    - Update status (admin)
DELETE /api/reservations/:id    - Delete (admin)
```

### Gallery
```
GET    /api/gallery             - List images
POST   /api/gallery             - Upload image (admin)
PUT    /api/gallery/:id         - Update image (admin)
DELETE /api/gallery/:id         - Delete image (admin)
```

### Restaurant Info
```
GET    /api/restaurant          - Get info
PUT    /api/restaurant          - Update info (admin)
```

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure both database and servers are running
4. Check browser console for frontend errors
5. Check terminal output for backend errors

---

**Happy coding! 🍷**
