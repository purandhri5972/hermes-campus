import { BriefingData, mockBriefingData } from './briefing';

export async function fetchBriefing(): Promise<BriefingData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Uncomment this to test the error state:
  // throw new Error('Network request failed');

  return mockBriefingData;
}
