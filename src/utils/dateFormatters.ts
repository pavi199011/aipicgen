
import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "h:mm a");
};
