const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatPostDate = (createdAt: string) => {
  const currentDate = new Date();
  const createdAtDate = new Date(createdAt);

  const seconds = Math.floor(
    (Number(currentDate) - Number(createdAtDate)) / 1000
  );
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 1000);
  const days = Math.floor(hours / 24);

  if (days > 1) {
    return createdAtDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } else if (days === 1) {
    return "1d";
  } else if (hours >= 1) {
    return `${hours}h`;
  } else if (minutes >= 1) {
    return `${minutes}m`;
  } else {
    return `Just now`;
  }
};

export const formatMemberSinceDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
};
