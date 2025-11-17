// utils/index.ts

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const truncateText = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
