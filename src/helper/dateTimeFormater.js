export const formatLastSeen = (date) => {
  if (!date) return "";
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return `Offline`;
  if (diffMin < 60) return `${diffMin} min ago`;
  return `Last seen at ${date.toLocaleTimeString()}`;
};
