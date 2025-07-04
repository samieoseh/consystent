export type HabitPayload = {
  title: string;
  routineId: number;
};

export type HabitTrackingPayload = {
  status: string;
  habitId: number;
  routineId: number;
  trackingDate: string;
  completionDate: string | null;
};
