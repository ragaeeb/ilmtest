import { randomUUID } from 'node:crypto';
import { tool } from '@langchain/core/tools';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';

/* ---------- Schema ---------- */
const hadithQuerySchema = z.object({
    q: z.string().describe('Query string that includes keywords to match English text against'),
});

/* ---------- Types for API ---------- */
type HadithItem = {
    id: number;
    hadithNumber: string;
    englishNarrator?: string | null;
    hadithEnglish?: string | null;
    headingEnglish?: string | null;
    status?: string | null;
    book?: { bookName?: string | null } | null;
    chapter?: { chapterEnglish?: string | null; id?: number | null } | null;
};

type HadithApiResponse = {
    status: number;
    message: string;
    hadiths?: {
        current_page?: number;
        data?: HadithItem[];
        next_page_url?: string | null;
        prev_page_url?: string | null;
        last_page?: number;
        per_page?: number;
        total?: number;
        first_page_url?: string;
        last_page_url?: string;
        path?: string;
    };
};

/* ---------- Agent Response Types ---------- */
// Define what the LLM should return
export const AgentHadithSchema = z.object({
    id: z.number(),
    hadithNumber: z.string(),
    englishNarrator: z.string().nullable(),
    hadithEnglish: z.string().nullable(),
    headingEnglish: z.string().nullable(),
    book: z.string().nullable(),
    chapter: z.string().nullable(),
    chapterId: z.union([z.number(), z.string()]).nullable(), // Accept both number and string
});

export const AgentSuccessResponseSchema = z.object({
    hadiths: z.array(AgentHadithSchema),
    pagination: z.object({
        current_page: z.number().nullable(),
        next_page: z.string().nullable().optional(), // Make optional to handle undefined
        prev_page: z.string().nullable().optional(), // Make optional to handle undefined
        per_page: z.number().nullable(),
        total: z.number().nullable(),
        last_page: z.number().nullable(),
    }),
    note: z.string().nullable(),
});

export const AgentErrorResponseSchema = z.object({
    error: z.literal(true),
    status: z.number(),
    statusText: z.string(),
    message: z.string(),
});

export const AgentResponseSchema = z.union([AgentSuccessResponseSchema, AgentErrorResponseSchema]);

// Helper type guards
export function isAgentError(response: AgentResponse): response is AgentErrorResponse {
    return 'error' in response && response.error === true;
}

export function isAgentSuccess(response: AgentResponse): response is AgentSuccessResponse {
    return !('error' in response) || !response.error;
}

// Export the TypeScript types
export type AgentHadith = z.infer<typeof AgentHadithSchema>;
export type AgentSuccessResponse = z.infer<typeof AgentSuccessResponseSchema>;
export type AgentErrorResponse = z.infer<typeof AgentErrorResponseSchema>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;

/* ---------- Tool Types ---------- */
type BukhariToolSuccess = {
    status: number;
    message: string;
    query: string;
    count: number;
    matches: Array<{
        id: number;
        hadithNumber: string;
        englishNarrator: string | null;
        hadithEnglish: string | null;
        headingEnglish: string | null;
        status: string | null;
        book: string | null;
        chapter: string | null;
    }>;
    pagination: {
        current_page: number | null;
        next_page: string | null;
        prev_page: string | null;
        per_page: number | null;
        total: number | null;
        last_page: number | null;
    };
    note: string | null;
};

type BukhariToolError =
    | { error: true; status: number; statusText: string; message: string }
    | { error: true; status: number; statusText: string; body: HadithApiResponse };

type BukhariToolResult = BukhariToolSuccess | BukhariToolError;

/* ---------- Tool ---------- */
export const bukhariListHadiths = tool<typeof hadithQuerySchema>(
    async (_input): Promise<BukhariToolResult> => {
        if (!process.env.HADITH_API_KEY) {
            return {
                error: true,
                status: 500,
                statusText: 'Missing HADITH_API_KEY',
                message: 'Set HADITH_API_KEY in your environment.',
            };
        }

        const url = new URL('https://hadithapi.com/api/hadiths');
        url.searchParams.set('book', 'sahih-bukhari');
        url.searchParams.set('apiKey', process.env.HADITH_API_KEY);

        try {
            const res = await fetch(url.toString(), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            const json = await res.json();

            if (!res.ok) {
                return {
                    error: true,
                    status: res.status,
                    statusText: res.statusText,
                    body: json,
                };
            }
            return json; // return full page of hadiths
        } catch (err: any) {
            return {
                error: true,
                status: 0,
                statusText: 'Network/Parse Error',
                message: err?.message ?? String(err),
            };
        }
    },
    {
        name: 'list_hadiths_from_bukhari',
        description:
            'Fetch the first page of ahadith from Sahih al-Bukhari (25 items). No keyword filtering. The LLM will analyze relevance.',
        schema: hadithQuerySchema,
    },
);

/* ---------- LLM + Agent ---------- */
const llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-pro',
    apiKey: process.env.GOOGLE_API_KEY || '',
    temperature: 0.2,
});

const SYSTEM_PROMPT = [
    'You are an Islamic Researcher.',
    'When the user queries with keywords:',
    '- Call the `list_hadiths_from_bukhari` tool with { q }, which fetches 25 raw hadiths.',
    '- Analyze the text content of those hadiths.',
    '- Return ONLY a valid JSON object with the following structure:',
    '- For successful responses: { "hadiths": [...], "pagination": {...}, "note": "..." }',
    '- For errors: { "error": true, "status": number, "statusText": "...", "message": "..." }',
    '- Each hadith in the array should include: id, hadithNumber, englishNarrator, hadithEnglish, headingEnglish, book (from book.bookName), chapter (from chapter.chapterEnglish), chapterId (from chapter.id).',
    '- Only include hadiths most relevant to the query, even if synonyms or Arabic terms are used (e.g. "niyyah" vs "intention").',
    '- If none are relevant, return an empty hadiths array.',
    '- If pagination shows more pages, add a note that more hadith may exist.',
    '- If the tool returns an error JSON, surface it as an error response.',
    '- IMPORTANT: Return ONLY the JSON object, no additional text, no markdown formatting, no code blocks.',
].join('\n');

const checkpointer = new MemorySaver();

export const app = createReactAgent({
    llm,
    tools: [bukhariListHadiths],
    checkpointSaver: checkpointer,
    stateModifier: SYSTEM_PROMPT,
});

/* ---------- Typed Response Handler ---------- */
export interface AgentRunResult {
    success: true;
    data: AgentSuccessResponse;
    threadId: string;
}

export interface AgentRunError {
    success: false;
    error: AgentErrorResponse | { error: true; status: number; statusText: string; message: string };
    threadId: string;
    rawContent?: string;
}

export type AgentResult = AgentRunResult | AgentRunError;

function safeJsonParse(content: string): unknown {
    // Trim whitespace
    let cleaned = content.trim();

    // Remove leading/trailing triple backticks + optional "json"
    if (cleaned.startsWith('```')) {
        cleaned = cleaned
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/```$/, '')
            .trim();
    }

    return JSON.parse(cleaned);
}

function validateAgentResponse(parsed: unknown): AgentResponse {
    const result = AgentResponseSchema.safeParse(parsed);

    if (!result.success) {
        throw new Error(`Invalid agent response structure: ${result.error.message}`);
    }

    return result.data;
}

/* ---------- Runner ---------- */
export async function runAgent(input: string, endpoint?: string, threadId?: string): Promise<AgentResult> {
    const human = endpoint ? `Fetch from ${endpoint} with q="${input}" and summarize briefly.` : input;
    const tid = threadId ?? randomUUID();

    try {
        const state = await app.invoke(
            { messages: [{ role: 'human' as const, content: human }] },
            { configurable: { thread_id: tid } },
        );

        const last = state.messages[state.messages.length - 1];
        const content =
            typeof last?.content === 'string' ? last.content : JSON.stringify(last?.content ?? last, null, 2);

        // Parse and validate the JSON response
        let parsed: unknown;
        try {
            parsed = safeJsonParse(content);
        } catch (parseError) {
            return {
                success: false,
                error: {
                    error: true,
                    status: 500,
                    statusText: 'JSON Parse Error',
                    message: `Failed to parse agent response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
                },
                threadId: tid,
                rawContent: content,
            };
        }

        // Validate against our schema
        let validatedResponse: AgentResponse;
        try {
            validatedResponse = validateAgentResponse(parsed);
        } catch (validationError) {
            return {
                success: false,
                error: {
                    error: true,
                    status: 500,
                    statusText: 'Validation Error',
                    message: `Agent response doesn't match expected schema: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`,
                },
                threadId: tid,
                rawContent: content,
            };
        }

        // Handle the response based on its type
        if (isAgentError(validatedResponse)) {
            // It's an error response
            return {
                success: false,
                error: validatedResponse,
                threadId: tid,
            };
        } else {
            // It's a success response - TypeScript now knows this is AgentSuccessResponse
            return {
                success: true,
                data: validatedResponse,
                threadId: tid,
            };
        }
    } catch (agentError) {
        return {
            success: false,
            error: {
                error: true,
                status: 500,
                statusText: 'Agent Execution Error',
                message: `Agent execution failed: ${agentError instanceof Error ? agentError.message : 'Unknown error'}`,
            },
            threadId: tid,
        };
    }
}
