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

const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    // Format like 28 MAY 2025
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
