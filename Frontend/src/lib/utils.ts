import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatDateProps =
  | {
      date: Date;
      type: "DATE";
    }
  | {
      date: Date;
      type: "DATETIME";
    }
  | {
      date: Date;
      format: string;
    };

export const formatDate = (props: FormatDateProps) => {
  const { date } = props;
  console.log({ date });
  if ("format" in props) {
    return format(date, props.format);
  }

  if (props.type === "DATE") {
    return format(date, "dd MMM yyyy");
  }

  return format(date, "dd MMM yyyy HH:mm");
};
