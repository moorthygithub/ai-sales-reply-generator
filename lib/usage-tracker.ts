export interface UsageStats {
  aiRequests: number;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  emailsSent: number;
  lastReset: string;
}

const today = (): string => new Date().toISOString().split("T")[0];

const defaultUsage: UsageStats = {
  aiRequests: 0,
  promptTokens: 0,
  responseTokens: 0,
  totalTokens: 0,
  emailsSent: 0,
  lastReset: today(),
};


const globalForUsage = globalThis as unknown as { usage: UsageStats | undefined };

export const usage: UsageStats = globalForUsage.usage ?? defaultUsage;

if (process.env.NODE_ENV !== "production") globalForUsage.usage = usage;

function resetIfNewDay() {
  const currentDay = today();
  if (usage.lastReset !== currentDay) {
    usage.aiRequests = 0;
    usage.promptTokens = 0;
    usage.responseTokens = 0;
    usage.totalTokens = 0;
    usage.emailsSent = 0;
    usage.lastReset = currentDay;
  }
}

export function incrementAIRequest() {
  resetIfNewDay();
  usage.aiRequests += 1;
}

export function addTokenUsage(prompt: number, response: number, total: number) {
  resetIfNewDay();
  usage.promptTokens += prompt;
  usage.responseTokens += response;
  usage.totalTokens += total;
}

export function incrementEmailSent() {
  resetIfNewDay();
  usage.emailsSent += 1;
}

export function getUsageStats(): UsageStats {
  resetIfNewDay();
  return { ...usage };
}
