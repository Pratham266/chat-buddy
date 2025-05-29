export const formatLastSeen = (date) => {
  if (!date) return "";

  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const isToday = now.toDateString() === date.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (isToday) {
    return `Last seen today at ${timeString}`;
  } else if (isYesterday) {
    return `Last seen yesterday at ${timeString}`;
  } else {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return `Last seen on ${dayName} at ${timeString}`;
  }
};
