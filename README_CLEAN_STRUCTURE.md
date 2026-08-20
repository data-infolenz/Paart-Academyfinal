# PAART Academy Clean React + Express + MySQL Structure

This is a clean JavaScript structure added beside the existing Next.js project.

## Folder Structure

```text
client/
  public/
    assets/
      images/
        brand/
        backgrounds/
        courses/
        gallery/
  src/
    api/
    components/
    data/
    App.jsx
    main.jsx
    styles.css

server/
  src/
    config/
    controllers/
    middleware/
    routes/
    app.js
    server.js

database/
  schema.sql
```

## Setup

1. Create the MySQL database and table:

```bash
mysql -u root -p < database/schema.sql
```

2. Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Install dependencies:

```bash
cd server
npm install

cd ..\client
npm install
```

4. Run the backend:

```bash
cd server
npm run dev
```

5. Run the frontend:

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Enquiry Flow

The React form posts to:

```text
POST http://localhost:5000/api/enquiries
```

The Express server stores the data in the MySQL `enquiries` table.
