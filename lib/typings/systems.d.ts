export type SystemPayload = {
  title: string;
  description: string | undefined;
  startDate: string;
  endDate: string | null;
  cadence: string | null;
  specificDays: string | null;
  isActive: number;
};

export type System = {
  id: number;
  title: string;
  description: string | null;
  cadence: string | null;
  specificDays: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: number | null;
  routineCount: number;
};
