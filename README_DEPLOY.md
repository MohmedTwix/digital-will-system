Deployment guide — Host frontend + backend and connect to MongoDB Atlas

Overview
- This repository is a simple static frontend plus a minimal Node/Express backend (`server.js`).
- Data models: users, contacts, emails (drafts), and recordings. The backend uses MongoDB (Atlas recommended).

Quick steps
1. Create a MongoDB Atlas cluster
   - Go to https://cloud.mongodb.com and create an account.
   - Create a free tier cluster and a database user (give a secure password).
   - In Network Access, allow access from anywhere (0.0.0.0/0) temporarily or add your host IP / cloud provider IPs.
   - Get the connection string and replace `<user>` and `<password>` and DB name in the string.

2. Set environment variables on the host
   - Define `MONGODB_URI` with your connection string.
   - Define `PORT` if required by the host.

3. Deploy options
- Render (recommended simple full-stack deploy):
  - Create a new Web Service, connect your GitHub repo, set `build` to `npm install` and `start` to `node server.js`.
  - Add `MONGODB_URI` to Environment > Environment Variables.

- Heroku:
  - `heroku create` then set config vars `heroku config:set MONGODB_URI="<your uri>"` and `git push heroku main`.

- Vercel / Netlify:
  - These are primarily static hosts. You can host only frontend and use serverless functions for API or use a separate Render/Heroku backend. For small projects, put the backend on Render and frontend on Vercel.

4. Update frontend to call API
  - Frontend should call endpoints under `/api/*` on your backend host (e.g., `https://your-app.onrender.com/api/contacts`).

Notes
- Recordings (video) saved as Data URLs in the database are OK for demo but not recommended for production — use object storage (S3, Cloud Storage) and store references in MongoDB.
- Secure auth: this demo uses a minimal auth flow; implement JWT/session and password hashing for production.

If you want, I can:
- Implement client-side code to use the API instead of localStorage.
- Create a Render/Heroku deployment config and test it (you'll need to provide Atlas URI or grant access).
- Add an automated screenshot tool and generate screenshots for the main pages (login, dashboard, record, numbers, email). See `tools/screenshots.js`.
