# ⚡ AI Resume Builder

A full-stack web application that uses the **OpenAI API** to generate professional, ATS-friendly resumes from user input.

**Stack:** React (Vite) · Node.js · Express · OpenAI · jsPDF

---

## 📁 Folder Structure

```
resume-builder/
├── backend/
│   ├── server.js          # Express app + OpenAI route
│   ├── package.json
│   ├── vercel.json        # Vercel serverless config
│   └── .env.example       # Environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── resumeApi.js        # Axios API helper
│   │   ├── components/
│   │   │   ├── ResumeForm.jsx      # Input form (9 fields)
│   │   │   ├── ResumeForm.css
│   │   │   ├── ResumePreview.jsx   # Preview + PDF download
│   │   │   ├── ResumePreview.css
│   │   │   ├── LoadingSpinner.jsx  # AI loading overlay
│   │   │   └── LoadingSpinner.css
│   │   ├── App.jsx                 # Root component & state
│   │   ├── App.css                 # Global dark-mode styles
│   │   ├── index.css               # Reset + scrollbar
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── vercel.json         # SPA rewrite for Vercel
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
| Tool | Version |
|------|---------|
| Node.js | v18+ |
| npm | v9+ |
| OpenAI API Key | [Get one here](https://platform.openai.com/api-keys) |

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-builder.git
cd resume-builder
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Create your .env file
copy .env.example .env        # Windows
# OR: cp .env.example .env    # Mac/Linux
```

Open `.env` and fill in your key:

```env
OPENAI_API_KEY=sk-...your_key_here...
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
node server.js
# ✅  Server running on http://localhost:5000
```

---

### 3. Set up the Frontend

Open a **new terminal** tab:

```bash
cd frontend
npm install

# Create your .env file
copy .env.example .env        # Windows
# OR: cp .env.example .env    # Mac/Linux
```

The default `.env` already points to `http://localhost:5000` — no changes needed for local dev.

Start the frontend:

```bash
npm run dev
# ➜  Local: http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## ☁️ Deployment to Vercel

Vercel can host **both** the frontend and backend for free.

### Deploy the Backend

1. Push the `backend/` folder to its own GitHub repository (or use a monorepo).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. In **Environment Variables**, add:
   - `OPENAI_API_KEY` = your key
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
4. Click **Deploy**. Vercel reads `backend/vercel.json` automatically.
5. Copy the deployed URL, e.g. `https://resume-builder-api.vercel.app`

### Deploy the Frontend

1. Push the `frontend/` folder to its own GitHub repository.
2. Go to Vercel → **New Project** → import the repo.
3. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://resume-builder-api.vercel.app` (your backend URL from above)
4. Set **Build Command**: `npm run build` | **Output Directory**: `dist`
5. Click **Deploy**. Vercel reads `frontend/vercel.json` for SPA rewrites.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Resume Form** | Name, Email, Phone, Skills, Education, Work Experience, Projects, Certifications, Career Summary |
| **AI Generation** | GPT-4o-mini generates a professional, ATS-optimised resume |
| **Live Preview** | Formatted resume card with section headings |
| **PDF Download** | One-click PDF export via jsPDF + html2canvas |
| **Loading Spinner** | Animated overlay while AI processes |
| **Input Validation** | Client-side + server-side validation |
| **Modern UI** | Dark glassmorphism design, responsive, Google Fonts |

---

## 🔑 Environment Variables Reference

### Backend `.env`
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | Your OpenAI secret key |
| `PORT` | ❌ | Server port (default: 5000) |
| `FRONTEND_URL` | ❌ | Allowed CORS origin |

### Frontend `.env`
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend base URL |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Axios, jsPDF, html2canvas
- **Backend**: Node.js, Express, OpenAI SDK v4, Helmet, CORS, dotenv
- **AI**: OpenAI `gpt-4o-mini` (configurable)
- **Deployment**: Vercel (frontend + backend)
