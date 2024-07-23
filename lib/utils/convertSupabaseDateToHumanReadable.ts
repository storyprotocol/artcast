export function convertSupabaseDateToHumanReadable(date: string) {
  const parsedDate = new Date(date);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  // @ts-ignore
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    parsedDate
  );
  return formattedDate;
}

export function convertSupabaseDateToShortHumanReadable(date: string) {
  const parsedDate = new Date(date);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  // @ts-ignore
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    parsedDate
  );
  return formattedDate;
}
