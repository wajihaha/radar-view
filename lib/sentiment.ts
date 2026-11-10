export type Sentiment = "Positive" | "Negative";

export interface SentimentPrediction {
  sentiment: Sentiment;
  confidence: number;
}

export type LocalModelPredictor = (
  text: string,
) => Promise<SentimentPrediction>;

export const LOCAL_MODEL_PATH = "/model.json";

const positiveWords = [
  "amazing",
  "awesome",
  "excellent",
  "fantastic",
  "love",
  "perfect",
  "recommend",
  "wonderful",
  "happy",
  "great",
];

const negativeWords = [
  "awful",
  "bad",
  "broken",
  "disappointed",
  "hate",
  "horrible",
  "poor",
  "refund",
  "terrible",
  "waste",
];

let localModelPredictor: LocalModelPredictor | null = null;

export function registerLocalModel(predictor: LocalModelPredictor) {
  localModelPredictor = predictor;
}

export async function predictSentiment(
  text: string,
): Promise<SentimentPrediction> {
  if (localModelPredictor) {
    return localModelPredictor(text);
  }

  const normalizedText = text.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    normalizedText.includes(word),
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    normalizedText.includes(word),
  ).length;
  const difference = positiveCount - negativeCount;
  const sentiment: Sentiment = difference >= 0 ? "Positive" : "Negative";
  const confidence = Math.min(0.94, 0.58 + Math.abs(difference) * 0.08);

  return { sentiment, confidence };
}
