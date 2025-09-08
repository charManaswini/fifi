# FiFi — Find your Film
Mood + intent movie recommendations. Tell FiFi your situation (“bad day, need hopeful” or “kid wants fun”, “scary horror”, “motivation to go to college/office”) and it returns 10 solid picks with a Netflix-style UI.

## ✨ Features
- **Two flows**
  - **Mood → Picks**: free-text intent parsing (Groq Mixtral) + TMDb search
  - **Classic filters** (genre)
- **Kid-safe mode**: detects “kid/family/animation” and auto-filters adult/scary stuff
- **Motivation mode**: detects school/college/office keywords; boosts inspiring/coach/team/coming-of-age titles
- **Fast, no DB**: TMDb live search, Groq for intent; edge-safe & server routes
- **Netflix-y UI**: black theme, glowing red pill CTA, horizontal carousel

## 🧰 Tech
- **Next.js (App Router)**, TypeScript, Tailwind
- **TMDb API** (catalog/search)
- **Groq API** (Mixtral-8x7B) for intent JSON
- No database (MVP)

## 🚀 Quickstart
```bash
npm i
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000

