export type SystemPayload = {
  title: string;
  description: string | undefined;
  startDate: string;
  endDate: string | null;
  cadence: string;
  isActive: number;
};
