export type FollowupStatus = 'upcoming' | 'due' | 'overdue' | 'complete' | 'cancelled';

export type FollowupSummary = {
  id: string;
  incidentNumber: string;
  shortDescription: string;
  assignedTo: string;
  assignmentGroup: string;
  status: FollowupStatus;
  dueAt: string;
  ageDays: number;
  attemptCount: number;
  repeatCycleCount: number;
  outcome?: string;
};

export type TeamMetrics = {
  upcoming: number;
  due: number;
  overdue: number;
  repeatCycles: number;
  averageAgeDays: number;
};

const sampleFollowups: FollowupSummary[] = [
  {
    id: 'demo-001',
    incidentNumber: 'INC-DEMO-001',
    shortDescription: 'User confirmation needed for access request',
    assignedTo: 'Demo Agent',
    assignmentGroup: 'Service Desk',
    status: 'due',
    dueAt: '2026-09-30 15:00',
    ageDays: 2,
    attemptCount: 1,
    repeatCycleCount: 1,
    outcome: 'Email sent',
  },
  {
    id: 'demo-002',
    incidentNumber: 'INC-DEMO-002',
    shortDescription: 'Awaiting caller response for device troubleshooting',
    assignedTo: 'Demo Agent',
    assignmentGroup: 'Service Desk',
    status: 'overdue',
    dueAt: '2026-09-29 10:30',
    ageDays: 4,
    attemptCount: 3,
    repeatCycleCount: 2,
    outcome: 'No response',
  },
];

export async function fetchTeamFollowups(): Promise<FollowupSummary[]> {
  return sampleFollowups;
}

export function calculateMetrics(items: FollowupSummary[]): TeamMetrics {
  const totalAge = items.reduce((sum, item) => sum + item.ageDays, 0);

  return {
    upcoming: items.filter((item) => item.status === 'upcoming').length,
    due: items.filter((item) => item.status === 'due').length,
    overdue: items.filter((item) => item.status === 'overdue').length,
    repeatCycles: items.filter((item) => item.repeatCycleCount > 1).length,
    averageAgeDays: items.length ? Math.round((totalAge / items.length) * 10) / 10 : 0,
  };
}

