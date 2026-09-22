export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  venue?: string;
}

export interface HackathonMatch {
  id: string;
  matchPercent: number;
  title: string;
  deadline: string;
  prizePool: string;
  reason: string;
}

export interface BriefingData {
  userName: string;
  emailsScanned: number;
  actionsRequired: number;
  hackathonMatch: HackathonMatch;
  schedule: ScheduleItem[];
}

export const mockBriefingData: BriefingData = {
  userName: 'Alex',
  emailsScanned: 18,
  actionsRequired: 2,
  hackathonMatch: {
    id: 'sih-2026',
    matchPercent: 96,
    title: 'Smart India Hackathon 2026',
    deadline: 'Sep 24',
    prizePool: '₹1,00,000',
    reason: 'Your Web3/AI skills match Problem Statement #4',
  },
  schedule: [
    { id: '1', time: '10:00 AM', title: 'Computer Networks Lab', venue: 'Block 3' },
    { id: '2', time: '02:00 PM', title: 'Free Slot', venue: 'Suggested: Hackathon Setup' },
    { id: '3', time: '05:00 PM', title: 'Switch Energy Case Prep Sync' },
  ],
};