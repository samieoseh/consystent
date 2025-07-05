export const getProgressColor = (progress: number): string => {
  if (progress < 33) return "#EF4444"; // Red
  if (progress < 66) return "#F59E0B"; // Orange
  return "#10B981"; // Green
};
