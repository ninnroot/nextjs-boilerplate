import { format } from "date-fns"

export const formatDate = (date: Date | string) => {
    return format(date, "dd/MM/yyyy")
}


export const formatTime = (time: Date | string) => {
    return format(time, "hh:mm a")
}

export const formatDateTime = (dateTime: Date | string) => {
    return format(dateTime, "dd/MM/yyyy hh:mm a")
}
export const getDateISOString = (date: Date) => {
    date = new Date(date);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };