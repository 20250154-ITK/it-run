# IT-Run Platform

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Backend setup
```bash
cd backend
npm install
# Copy env file and edit if needed
cp .env.example .env
# Start the server
npm run dev
```

### 2. Seed demo data (optional)
```bash
cd backend
node seed.js
```

Demo login after seeding:
- Email: `lilly@example.com`
- Password: `password123`

### 3. Frontend setup
```bash
cd frontend
npm install
# .env is already configured for localhost
npm run dev
```

Open http://localhost:5173

---

## Project Structure
```
itrun-platform/
├── backend/
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── middleware/     # Auth middleware
│   ├── server.js       # Entry point
│   └── seed.js         # Demo data seeder
└── frontend/
    └── src/
        ├── api/        # Axios client & services
        ├── context/    # AuthContext
        ├── pages/      # Route pages
        └── components/ # UI components
```
