# 🧠 AI-Powered Resume Builder ✨  
> Built with 💻 React, Tailwind CSS, Supabase SQL, Gemini API, Clerk Auth & Shadcn UI

Welcome to the **AI Resume Builder** — a powerful full-stack web application designed to help users craft professional, personalized resumes effortlessly using **AI-driven suggestions**, real-time updates, and beautiful UI components.

---

## 🚀 Live Preview

🌐 [Visit the Live App](https://ai-resume-builder-mzkd.onrender.com/)  
🔐 Test Credentials: Use Clerk signup/login or social providers

---

## 🛠️ Tech Stack

| Layer         | Technology Used                         |
|---------------|------------------------------------------|
| 🧠 AI Engine   | Gemini API (Google Generative AI)        |
| 🔐 Auth        | Clerk (email, password, OAuth)           |
| 💾 Database    | Supabase (PostgreSQL-based SQL)          |
| 🌐 Frontend    | React + Tailwind CSS + Shadcn UI         |
| 🎨 Styling     | Tailwind CSS      |
| 🔧 Language    | JavaScript (ES6+)                        |

---

## 📦 Features

✅ AI-generated suggestions for job titles, summaries, and achievements  
✅ Authentication with Clerk (email/password + Google)  
✅ Real-time resume updates (Supabase SQL syncing)  
✅ Beautiful drag-and-edit UI using **Shadcn UI**  
✅ Export options: PDF  
✅ Profile image upload and preview  
✅ color mode toggle across resume  
✅ Fully responsive for all devices

---

## 🧑‍💻 Pages & Flow

### 🔐 Authentication
- Handled via **Clerk** (magic link, password, Google login)
- Dynamic user routing post-login

### 📝 Resume Editor
- Create/edit: Personal info, experience, education, skills
- Uses **Supabase** to store and sync data in SQL tables per user
- Editable sections with Shadcn components (`Card`, `Input`, `Textarea`)

### 🤖 AI Suggestions
- One-click "✨ Ask AI" buttons beside each section
- Gemini API provides content suggestions: role-specific summaries, bullets, etc.

### 🌗 color Mode & UX
- Resume deferent color mode toggle
- Smooth animations with Tailwind + Framer Motion
- Clean, distraction-free editing experience

Let me know if you'd like:
- 🧠 Sample Gemini prompts
- 🧩 Actual code for AI suggestion logic
- 📄 Screenshots or dark/light theme toggles  
- 💾 SQL setup instructions for Supabase

I'm happy to help flesh it all out!

---
## ⚙️ Getting Started Locally
1. Clone the repo:
```bash
git clone https://github.com/nirdeshbhesaniya/Resume-builder-app.git
cd ai-resume-builder
---
2. Install Dependancy 
npm install
---
3. Create .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_GEMINI_API_KEY=your_gemini_api_key
---
4. Run the App
npm run dev



