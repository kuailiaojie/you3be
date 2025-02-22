
export interface OpenAPISummaryResponse {
  success: boolean;
  id: string;
  service: string;
  sourceUrl: string;
  htmlUrl: string;
  costDuration: number;
  remainingTime: number;
  summary: string;
  detail?: {
    title: string;
    descriptionText: string;
  };
}

export interface ChatResponse {
  success: boolean;
  id: string;
  service: string;
  sourceUrl: string;
  htmlUrl: string;
  costDuration: number;
  remainingTime: number;
  answer: string;
  sourceDocuments?: Array<{
    pageContent: string;
    metadata: Record<string, any>;
  }>;
}

export async function getSummary(videoId: string) {
  const apiToken = localStorage.getItem('BILIGPT_API_KEY');
  if (!apiToken) {
    throw new Error('BibiGPT API key not found');
  }

  const response = await fetch(`https://bibigpt.co/api/open/${apiToken}?url=https://www.youtube.com/watch?v=${videoId}`);
  const data = await response.json();
  return data as OpenAPISummaryResponse;
}

export async function chatWithVideo(videoId: string, question: string, history: [string, string][] = []) {
  const apiToken = localStorage.getItem('BILIGPT_API_KEY');
  if (!apiToken) {
    throw new Error('BibiGPT API key not found');
  }

  const response = await fetch(`https://bibigpt.co/api/open/${apiToken}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      question,
      history,
      language: localStorage.getItem('language') || 'en'
    }),
  });
  const data = await response.json();
  return data as ChatResponse;
}
