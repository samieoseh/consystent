export type RoutinePayload = {
  systemId: number;
  title: string;
  cadence: string;
  startTime: string;
};

export type Routine = {
  id: number;
  title: string;
  cadence: string;
  startTime: string | null;
};
