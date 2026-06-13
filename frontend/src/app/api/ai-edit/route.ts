import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, timeline } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "API key is missing from environment variables." }, { status: 500 });
    }

    const systemPrompt = `
You are an expert AI Video Editor Assistant acting as a Non-Linear Editor (NLE) copilot.
You receive the current state of a video timeline as a JSON array of items, and a user's instruction.
Analyze the user's instruction and the timeline, and return ONLY a new, updated JSON array of the timeline items representing the desired changes.

Here is the TypeScript interface for a TimelineItem:
interface TimelineItem {
  id: string; // Keep existing IDs if you modify them, generate new random 9-char alphanumeric string if you add them
  trackId: 'V1' | 'A1' | 'T1'; // V1 is video, A1 is audio, T1 is text
  mediaId?: string;
  url?: string;
  name?: string;
  text?: string;
  startTime: number; // Time in seconds on the timeline where the clip starts
  duration: number; // Duration in seconds
  sourceOffset: number; // Offset from the original source file
  filter?: string; // CSS filter string (e.g., "grayscale(100%)", "sepia(100%)")
  x?: number; // X position percentage for text (0-100)
  y?: number; // Y position percentage for text (0-100)
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  rotation?: number;
}

IMPORTANT RULES:
1. Your response must be valid JSON only (an array of TimelineItem objects).
2. Do not wrap the JSON in markdown code blocks (\`\`\`json). Just return the raw JSON array.
3. Apply the requested changes exactly as asked. (e.g. if asked to add text, add a T1 item with text properties).
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Using a fast, reliable model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the current timeline JSON:\n${JSON.stringify(timeline, null, 2)}\n\nUser Instruction: ${prompt}` }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let aiContent = data.choices[0].message.content.trim();
      
      // Strip markdown code blocks if the AI accidentally adds them
      if (aiContent.startsWith("```json")) {
        aiContent = aiContent.replace(/^```json\n?/, "").replace(/```$/, "").trim();
      } else if (aiContent.startsWith("```")) {
        aiContent = aiContent.replace(/^```\n?/, "").replace(/```$/, "").trim();
      }
      
      const newTimeline = JSON.parse(aiContent);
      return NextResponse.json({ timeline: newTimeline });
    } else {
      console.error("Unexpected OpenRouter response:", data);
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 });
    }

  } catch (error) {
    console.error("AI Edit Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
