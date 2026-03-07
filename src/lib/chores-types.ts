export type ChildRecord = {
  id: string;
  name: string;
  emoji: string | null;
  color: string | null;
  order: number;
  createdAt: string;
};

export type ChoreFrequency = "daily" | "weekdays" | "weekly";

export type ChoreRecord = {
  id: string;
  title: string;
  points: number;
  frequency: ChoreFrequency;
  icon: string | null;
  order: number;
  childIds: string[] | null;
  timesPerDay: number;
  shared: boolean;
  penalty: boolean;
  createdAt: string;
};

export type ChoreCompletionRecord = {
  choreId: string;
  title: string;
  points: number;
  frequency: ChoreFrequency;
  icon: string | null;
  penalty: boolean;
  completionId: string | null;
  completedAt: string | null;
};

export type ScoreRecord = {
  id: string;
  name: string;
  emoji: string | null;
  color: string | null;
  points: number;
  rank: number;
};

export type ScoresResponse = { children: ScoreRecord[] };

export type ChildWithChores = {
  id: string;
  name: string;
  emoji: string | null;
  color: string | null;
  todayPoints: number;
  weekPoints: number;
  chores: ChoreCompletionRecord[];
};

export type ChoreCompletionsResponse = {
  children: ChildWithChores[];
};

export type ChildStreakRecord = {
  childId: string;
  streak: number;
};

export type StreaksResponse = {
  streaks: ChildStreakRecord[];
};

export type RewardRecord = {
  id: string;
  title: string;
  pointsCost: number;
  icon: string | null;
  order: number;
  createdAt: string;
};

export type RewardClaimRecord = {
  id: string;
  rewardId: string;
  childId: string;
  pointsSpent: number;
  claimedAt: string;
};

export type ChildBalanceRecord = {
  childId: string;
  earned: number;
  spent: number;
  balance: number;
};

export type BalancesResponse = {
  balances: ChildBalanceRecord[];
};
