export const getCurrentTimeFormatted = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const hoursFormatted = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesFormatted = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hoursFormatted}:${minutesFormatted}`;
};
