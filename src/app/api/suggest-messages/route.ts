import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform like Qooh.me. Avoid personal or sensitive topics; focus on universal, friendly, and fun prompts. Example format: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Make them intriguing, positive, and inclusive.";

    const result = await streamText({
      model: google('models/gemini-2.5-flash'), // Use models/ prefix
      prompt,
    });

    // Don't console.log the stream - it interferes with streaming
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Gemini Suggest Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate suggestions' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}