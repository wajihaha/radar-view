import { NextResponse } from "next/server";
import { generateReviewResponse } from "@/lib/gemini";
import { predictSentiment } from "@/lib/sentiment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send valid JSON." }, { status: 400 });
  }

  const review =
    body && typeof body === "object" && "review" in body
      ? body.review
      : undefined;

  if (typeof review !== "string" || !review.trim()) {
    return NextResponse.json(
      { error: "Enter a review before analyzing." },
      { status: 400 },
    );
  }

  if (review.length > 5000) {
    return NextResponse.json(
      { error: "Reviews must be 5,000 characters or fewer." },
      { status: 413 },
    );
  }

  const prediction = await predictSentiment(review);

  try {
    const aiResponse = await generateReviewResponse(review, prediction.sentiment);
    const generated = aiResponse ?? {
      explanation:
        "This starter version uses a simple keyword-based sentiment estimate. Add a Gemini API key to get an explanation tailored to the review.",
      suggestedReply:
        "Thank you for taking the time to share your feedback. We appreciate hearing from you and will keep it in mind.",
    };

    return NextResponse.json({
      ...prediction,
      ...generated,
      aiGenerated: aiResponse !== null,
    });
  } catch {
    return NextResponse.json(
      { error: "Gemini could not analyze this review. Please try again." },
      { status: 502 },
    );
  }
}
