export type ChatSender = 'hermes' | 'user';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: string; // e.g. "08:31 AM"
}

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'hermes',
    text: 'Found your SIH team invite on Discord from @sarah. I verified she covers Frontend/Figma. Shall I draft the confirmation message?',
    timestamp: '08:30 AM',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Yes, and make sure she knows we are targeting Track #4.',
    timestamp: '08:31 AM',
  },
  {
    id: '3',
    sender: 'hermes',
    text: 'Draft ready in WhatsApp queue. Also, SIH registration closes in 48 hours. Ready to review your sprint plan?',
    timestamp: '08:31 AM',
  },
];

export const mockMemoryCount = 42;

export const mockWorkerStatus = {
  active: true,
  filteredCirculars: 14,
  syncedDeadlines: 1,
};

// Simulates an async fetch — swap for a real API call later.
export function fetchChatMessages(): Promise<ChatMessage[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMessages), 800);
  });
}