# ReviewRadar

A small review-analysis app built with Next.js App Router, TypeScript, and Tailwind CSS. Paste a customer review to get a placeholder sentiment prediction, an explanation, and a suggested reply. Gemini adds the explanation and reply when `GEMINI_API_KEY` is configured.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
cp .env.example .env.local
# Add your Gemini API key to .env.local (optional; without it, the app uses a clearly labeled local fallback).
npm run dev
```

Open http://localhost:3000.

## Files

- `app/page.tsx`: Single-page review input, loading, error, and result states.
- `app/api/analyze/route.ts`: Validates requests, predicts sentiment, and coordinates the optional Gemini response.
- `lib/sentiment.ts`: Keyword-based placeholder classifier and typed adapter boundary for a future local model at `/model.json`.
- `lib/gemini.ts`: Gemini prompt and response handling using `gemini-2.5-flash-lite`.
- `app/globals.css`: Tailwind directives and the page's responsive visual styling.
- `.env.example`: Environment variable template.

The sentiment classifier is intentionally a placeholder, not a trained model. `lib/sentiment.ts` defines the prediction interface and model path so a real model runtime can replace the keyword implementation later.