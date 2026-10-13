# Numberly

A full-stack number guessing game built with React, Spring Boot, and H2.

## Run locally

### Backend

```powershell
cd backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to Spring Boot.

