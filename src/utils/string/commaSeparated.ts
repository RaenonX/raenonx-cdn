export const commaSeparatedStringToArray = (value: string): string[] => {
  return value.split(',').map((item) => item.trim());
};
