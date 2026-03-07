export type ChildRecord = {
  id: string;
  name: string;
  emoji: string | null;
  color: string | null;
  order: number;
  createdAt: string;
};

export type ChoreRecord = {
  id: string;
  title: string;
  points: number;
  frequency: "daily" | "weekly";
  icon: string | null;
  order: number;
  childIds: string[] | null;
  createdAt: string;
};

export type ChoreCompletionRecord = {
  choreId: string;
  title: string;
  points: number;
  frequency: "daily" | "weekly";
  icon: string | null;
  completionId: string | null;
  completedAt: string | null;
};

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
