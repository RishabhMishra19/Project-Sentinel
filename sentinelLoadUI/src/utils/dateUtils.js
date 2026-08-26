export const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const toInstant = (date) => {
  if (!date) {
    return null;
  }

  return new Date(
    `${date}T00:00:00`
  ).toISOString();
};