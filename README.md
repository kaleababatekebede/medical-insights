# Medical Insights 🩺

> An evidence-based health education platform dedicated to translating complex clinical guidance, oncology research, and chronic disease prevention into clear, accessible insights.
---

## 🌟 Overview

**Medical Insights** is a modern, lightweight medical publication and patient education website authored by **Dr. Kaleab Abate** 

The platform is built with a **zero-build static architecture** (HTML5, CSS, JavaScript) paired with a **Supabase PostgreSQL** cloud backend. It delivers fast page loads, clean typography, strict medical editorial standards, and an intuitive administrative interface.

---

## ✨ Features

- **Evidence-Based Medical Library**: Full article catalog with live keyword search and topic filters.
- **Core Clinical Topics**: Dedicated hubs for Oncology, Diabetes Mellitus, Hypertension, Asthma, Cancer Screening, and Preventive Health.
- **Single Article View**: Readable typography, clinical citations, author bylines, and related reading recommendations.
- **Physician Profile & CV**: Professional biography, clinical principles, and 1-click Curriculum Vitae (CV) download.
- **Secure Reader Inquiries**: Embedded contact form connecting directly to the Supabase database with emergency clinical disclaimers.
- **Administrative Portal (`admin.html`)**: Protected login for the physician to compose drafts, publish articles, and manage reader inquiries.
- **Zero-Build Simplicity**: No Node.js build step or bundler needed—runs directly in any modern browser.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Custom Design System), JavaScript (ES Modules) |
| **Typography** | Google Fonts (*Fraunces* serif for headlines, *Instrument Sans* for UI/body) |
| **Icons** | [Lucide Icons](https://lucide.dev/) |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row-Level Security, Auth) |
| **Deployment** | GitHub Pages, Cloudflare Pages, Netlify, or Vercel |

---

## 📁 Project Structure

```text
├── index.html            # Homepage (Hero, Featured articles, Topics, Author bio)
├── articles.html         # Health Library (Search, topic filtering, article grid)
├── article.html          # Individual Article View (Body, citations, related posts)
├── category.html         # Category Hub (Dynamic topic overview & filtered catalog)
├── about.html            # Author Biography, credentials & editorial ethics
├── contact.html          # Inquiries form with emergency medical notice
├── admin.html            # Secure Admin Dashboard (Write, edit, publish & inbox)
├── style.css             # Unified design system & responsive styling
├── main.js               # Shared logic, header/footer chrome, and card renderer
├── supabase.js           # Supabase client credentials & site author metadata
├── schema.sql            # Supabase database schema, tables & RLS security rules
├── sample_articles.sql   # 12 starter clinical articles across all 6 topics
├── .nojekyll             # Ensures GitHub Pages serves static files directly
├── favicon.svg           # Scalable vector medical favicon
└── assets/
    ├── css/style.css     # Production CSS bundle
    ├── js/main.js        # Production JS modules
    ├── cv.pdf            # Downloadable physician Curriculum Vitae (CV)
    └── img/
        ├── portrait.png  # Author portrait photo
        ├── favicon.svg   # Favicon asset
        └── favicon-32x32.png
```

---

## 🚀 Getting Started

### 1. Run Locally

Because the project uses modern ES JavaScript modules, it should be served over local HTTP rather than opened as a local `file://`.

Open your terminal in this project folder and run:

```bash
# Using Python 3 (pre-installed on macOS/Linux)
python3 -m http.server 8000
```

Then visit **`http://localhost:8000`** in your browser.

---

## ⚖️ Clinical Disclaimer

All content published on **Medical Insights** is intended solely for educational purposes and health literacy. It does not replace individualized clinical judgment, medical diagnosis, or personalized treatment from a qualified healthcare provider.

---
