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
  systemId: number;
};

export type RoutineTrackingPayload = {
  status: string;
  systemId: number;
  routineId: number;
  trackingDate: string;
  completionDate: string | null;
};
