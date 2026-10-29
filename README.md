# Nilesh Pardhi — Personal Data Analyst Portfolio

A modern, premium, responsive personal portfolio website designed for **Nilesh Pardhi**, an aspiring Data Analyst currently pursuing a B.Tech in Artificial Intelligence & Machine Learning. Built to showcase technical acumen in Python, SQL, Power BI, and business intelligence to recruiters and hiring managers.

---

## 🚀 Key Features

- **Tailored Data Analytics SaaS Aesthetics**: Built with a sleek dark palette (`#080B12`, `#101522`, `#141B2D`) featuring cyan (`#00E5FF`) and purple (`#7C5CFC`) glowing accents and glassmorphism.
- **Hero Section**:
  - Live animated badge: *"Available for Data Analyst Internship Opportunities"* with pulsing status indicator.
  - Profile frame featuring Nilesh's actual photo with a 3D mouse tilt effect and floating data badges (SQL query, Python `.groupby()`, mini KPI bar chart, and 9,990+ records metric).
  - Dynamic cycling focus line: *"Turning Data into Insights"*, *"Building Interactive Dashboards"*, *"Solving Business Problems with Data"*, *"Transforming Raw Data into Decisions"*.
  - Direct CTAs: *"Explore My Projects"* and *"Download Resume"*.
- **Interactive Technical Toolkit**:
  - Categorized chips for Programming & Analysis, Database & SQL, Business Intelligence, Spreadsheet & EDA, and Development Tools.
  - Interactive category filter tabs for streamlined recruiter inspection.
  - No misleading percentage bars; focuses strictly on genuine competencies and applications.
- **Featured Projects Showcase**:
  1. **ICC Men's Cricket World Cup 2023 Analysis** (Python, SQL, Power BI, Pandas, Matplotlib)
  2. **AI Job Market Intelligence Platform** (1,500+ postings, EDA, SQL, Python)
  3. **Superstore Sales Analysis Dashboard** (Power BI, SQL, Python; exact verified metrics: $2.30M Sales, $286.40K Profit, 793 Customers, ~5K Orders, ~12% Margin)
  - Interactive **Project Deep Dive Modals**: Clicking *"View Project"* opens an in-depth modal featuring the problem scope, data engineering pipeline, raw SQL query CTEs/window functions, and quantified business discoveries.
- **Education Timeline**:
  - Highlights B.Tech in AI & ML at Guru Nanak Institute of Technology (3rd Year, 7.5 CGPA) and Diploma in Computer Technology at Government Polytechnic Sakoli (78.68%).
- **4-Step Analytics Methodology**:
  - 01: Understand the Problem &rarr; 02: Prepare the Data &rarr; 03: Analyze the Data &rarr; 04: Communicate Insights.
- **Contact & Connect**:
  - Real form validation with direct `mailto:` fallback and configurable webhook/Formspree integration.
  - Sticky glass navbar with scrollspy and mobile drawer menu.
  - Custom SVG favicon with **NP** monogram.

---

## 📁 Project Structure

```text
Portfollio_Website/
│
├── index.html                   # Main semantic HTML5 webpage
├── README.md                    # Documentation & setup guide
│
├── css/
│   └── style.css                # Custom CSS design system, dark SaaS tokens & animations
│
├── js/
│   ├── config.js                # Central configuration file for all links & credentials
│   └── main.js                  # Interactivity: Scrollspy, 3D tilt, modals, form validation
│
└── assets/
    ├── nilesh-profile.png       # Nilesh's uploaded professional portrait
    ├── resume.pdf               # Resume document (ready to download/replace)
    ├── favicon.svg              # NP Monogram SVG favicon
    ├── cricket-dashboard.svg    # High-fidelity Cricket Analytics preview
    ├── job-market-dashboard.svg # High-fidelity Job Market Intelligence preview
    └── superstore-dashboard.svg # High-fidelity Superstore Power BI preview
```

---

## ⚙️ How to Customize Your Links & Information

All personal details, URLs, and file paths are centralized in [`js/config.js`](file:///c:/Desktop/Portfollio_Website/js/config.js):

1. **Social & Contact Links**:
   ```javascript
   socialLinks: {
     linkedin: "https://www.linkedin.com/in/your-actual-profile",
     github: "https://github.com/your-actual-username",
     email: "your.email@example.com"
   }
   ```
2. **Project Repositories**:
   ```javascript
   projects: {
     cricket: {
       githubUrl: "https://github.com/your-username/cricket-analysis",
       liveDemoUrl: "" // Optional live dashboard URL
     },
     ...
   }
   ```
3. **Resume PDF**:
   - To update your resume, replace [`assets/resume.pdf`](file:///c:/Desktop/Portfollio_Website/assets/resume.pdf) with your updated file.
4. **Contact Form & Email Delivery (Resend API)**:
   - The form is powered by the official **Resend Email API** (`resend`) via a server-side endpoint (`/api/contact`).
   - Create a free account at [Resend](https://resend.com/) and copy your API Key (`re_...`) into a `.env` file (copied from `.env.example`):
   ```env
   # Server-side Resend API Key (never exposed to frontend)
   RESEND_API_KEY=re_your_actual_resend_api_key

   # Recipient email inbox
   CONTACT_EMAIL=nileshpardhi.analytics@gmail.com

   # Sender address (use onboarding@resend.dev for testing or your verified domain)
   RESEND_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
   ```

---

## 💻 Running Locally

### Option 1: Vite Development Server with Resend Middleware (Recommended)
```bash
npm run dev
```
Navigate to `http://localhost:5173`. In local development, `POST /api/contact` requests are seamlessly handled by Vite's dev server middleware using your `.env` variables and the Node Resend SDK.

### Option 2: Standalone Production Node Server
```bash
npm run build
npm start
```
Runs the production server (`server.js`) on `http://localhost:3000` with static asset serving and the `/api/contact` endpoint.

---

## 🌐 Production Deployment Guide

### Deployment on Vercel (Recommended for Serverless)
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. In **Project Settings** &rarr; **Environment Variables**, add:
   - `RESEND_API_KEY`: Your Resend API key (starts with `re_`)
   - `CONTACT_EMAIL`: `nileshpardhi.analytics@gmail.com`
   - `RESEND_FROM_EMAIL`: `Portfolio Contact <onboarding@resend.dev>` (or your verified domain address)
4. Click **Deploy**. Vercel will automatically host the static website and mount [`api/contact.js`](file:///c:/Desktop/Portfollio_Website/api/contact.js) as a Serverless Function.

### Deployment on Render / Railway / VPS (Node.js)
1. Set the build command to `npm run build`.
2. Set the start command to `npm start`.
3. Add the environment variables `RESEND_API_KEY`, `CONTACT_EMAIL`, and `RESEND_FROM_EMAIL` in the dashboard settings.

---

## 📧 Resend Sender & Domain Verification Notes
- **Testing (`onboarding@resend.dev`)**: Resend provides `onboarding@resend.dev` as a sandbox sender. On the free tier without a verified domain, Resend requires that the recipient email matches the email address registered with your Resend account.
- **Production (Custom Domain)**: For receiving messages from anyone and sending with your brand:
  1. Go to **Resend Dashboard** &rarr; **Domains** &rarr; **Add Domain** (e.g., `yourdomain.com`).
  2. Add the provided DNS records (DKIM, SPF, MX) at your DNS provider.
  3. Once verified, change `RESEND_FROM_EMAIL` in your environment variables to `Portfolio Contact <contact@yourdomain.com>`.

1. Create a new repository on GitHub named `portfolio` or `username.github.io`.
2. Push this folder to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. Go to **Settings** &rarr; **Pages** &rarr; select `main` branch &rarr; **Save**. Your portfolio will be live worldwide in seconds!
