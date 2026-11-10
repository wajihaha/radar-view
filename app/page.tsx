"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Clipboard,
  LoaderCircle,
  Radar,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { Sentiment } from "@/lib/sentiment";

interface AnalysisResult {
  sentiment: Sentiment;
  confidence: number;
  explanation: string;
  suggestedReply: string;
  aiGenerated: boolean;
}

const exampleReview =
  "The quality is fantastic and it arrived earlier than expected. I've already recommended it to my friends!";

export default function Home() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function analyzeReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setResult(data as AnalysisResult);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReply() {
    if (!result) return;
    await navigator.clipboard.writeText(result.suggestedReply);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function resetAnalysis() {
    setResult(null);
    setError("");
    setReview("");
  }

  return (
    <main className="min-h-screen px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-ink/10 pb-5">
          <a href="#home" className="flex items-center gap-2.5" aria-label="ReviewRadar home">
            <span className="brand-mark"><Radar size={19} strokeWidth={2.2} /></span>
            <span className="font-display text-[21px] font-semibold tracking-[-0.03em]">
              review<span className="text-leaf">radar</span>
            </span>
          </a>
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="live-dot" />
            REVIEW INSIGHTS
          </div>
        </header>

        <section id="home" className="page-intro py-10 sm:py-14">
          <div className="eyebrow"><span /> CUSTOMER FEEDBACK, MADE CLEAR</div>
          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.98] tracking-[-0.055em]">
                Every review has
                <br />
                <span className="headline-accent">a story to tell.</span>
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted">
                Understand how customers feel, why they feel that way, and what to say next.
              </p>
            </div>
            <div className="hidden items-center gap-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted md:flex">
              <Sparkles size={14} className="text-amber" />
              One review at a time
            </div>
          </div>
        </section>

        <section className="workspace-grid" aria-label="Review analyzer">
          <form onSubmit={analyzeReview} className="input-panel">
            <div className="panel-heading">
              <div>
                <span className="step-label">01 / THE REVIEW</span>
                <h2 className="font-display mt-2 text-[23px] font-medium tracking-[-0.03em]">What did they say?</h2>
              </div>
              <span className="review-icon"><ArrowUpRight size={17} /></span>
            </div>

            <label htmlFor="review" className="sr-only">Paste a customer review</label>
            <textarea
              id="review"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              maxLength={5000}
              placeholder="Paste a product or customer review here..."
              className="review-input"
            />
            <div className="flex items-center justify-between text-xs text-muted">
              <button
                type="button"
                onClick={() => setReview(exampleReview)}
                className="example-button"
              >
                Try an example <ArrowUpRight size={12} />
              </button>
              <span>{review.length.toLocaleString()} / 5,000</span>
            </div>

            {error && (
              <div role="alert" className="error-message">
                <CircleAlert size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!review.trim() || isLoading}
              className="analyze-button"
            >
              {isLoading ? (
                <><LoaderCircle size={16} className="spin" /> Reading your review...</>
              ) : (
                <><Sparkles size={16} /> Analyze review <ArrowUpRight size={15} className="ml-auto" /></>
              )}
            </button>
            <p className="input-footnote">Your review is only used to generate this analysis.</p>
          </form>

          <section className={`results-panel ${result ? "has-result" : ""}`} aria-live="polite" aria-label="Analysis results">
            {isLoading ? (
              <div className="empty-state">
                <span className="loading-orbit"><Radar size={25} /></span>
                <h2 className="font-display mt-5 text-xl">Finding the signal...</h2>
                <p className="mt-2 text-sm text-muted">We’re looking for the feeling behind the feedback.</p>
              </div>
            ) : result ? (
              <div className="result-content">
                <div className="result-topline">
                  <span className="step-label">02 / THE READOUT</span>
                  <button type="button" className="icon-button" onClick={resetAnalysis} aria-label="Start a new analysis" title="New analysis">
                    <RotateCcw size={15} />
                  </button>
                </div>

                <div className={`sentiment-card ${result.sentiment === "Positive" ? "positive" : "negative"}`}>
                  <div className="sentiment-icon">
                    {result.sentiment === "Positive" ? <ThumbsUp size={19} /> : <ThumbsDown size={19} />}
                  </div>
                  <div>
                    <span className="micro-label">SENTIMENT</span>
                    <div className="font-display mt-0.5 text-[30px] leading-none tracking-[-0.04em]">{result.sentiment}</div>
                  </div>
                  <div className="confidence">
                    <span className="micro-label">CONFIDENCE</span>
                    <span className="mt-1 block text-lg font-semibold tabular-nums">{Math.round(result.confidence * 100)}%</span>
                  </div>
                </div>

                <div className="result-section">
                  <div className="section-title"><Sparkles size={14} /> WHY IT FEELS THIS WAY</div>
                  <p className="result-copy">{result.explanation}</p>
                  {!result.aiGenerated && <span className="fallback-note">Starter explanation · Add a Gemini API key for tailored insights</span>}
                </div>

                <div className="reply-section">
                  <div className="flex items-center justify-between gap-3">
                    <div className="section-title"><span className="reply-dot" /> A THOUGHTFUL REPLY</div>
                    <button type="button" onClick={copyReply} className="copy-button" aria-label="Copy suggested reply">
                      {copied ? <Check size={14} /> : <Clipboard size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="reply-copy">“{result.suggestedReply}”</p>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="radar-art" aria-hidden="true">
                  <span className="radar-ring ring-one" />
                  <span className="radar-ring ring-two" />
                  <span className="radar-ring ring-three" />
                  <span className="radar-sweep" />
                  <span className="radar-center"><Radar size={22} /></span>
                  <span className="radar-signal signal-one" />
                  <span className="radar-signal signal-two" />
                </div>
                <h2 className="font-display mt-5 text-xl tracking-[-0.025em]">Your readout starts here</h2>
                <p className="mt-2 max-w-xs text-center text-sm leading-6 text-muted">
                  Add a review and we’ll surface the sentiment, the why, and a reply worth sending.
                </p>
                <div className="empty-tags">
                  <span>Sentiment</span><i /><span>Context</span><i /><span>Response</span>
                </div>
              </div>
            )}
          </section>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-ink/10 pt-5 text-[11px] font-medium text-muted sm:flex-row">
          <span>REVIEWRADAR <span className="footer-separator">/</span> FEEDBACK, IN FOCUS</span>
          <span>Sentiment is an estimate. Always review AI-generated replies before sending.</span>
        </footer>
      </div>
    </main>
  );
}
