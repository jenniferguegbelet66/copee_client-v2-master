import dayjs from "dayjs";
dayjs().format();

export const rfc3339dateFormat = "YYYY-MM-DDTHH:mm:ss[Z]";

export function formatDateForBackend(date: string): string {
  // format date according to the backend time based on RFC3339
  const formattedDate: string = dayjs(date).format(rfc3339dateFormat);
  return formattedDate;
}
