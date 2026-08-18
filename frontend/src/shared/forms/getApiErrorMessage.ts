import axios from "axios";
import type { ApiError } from "../dto/response";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (typeof data?.message === "string" && data.message.length > 0) {
      return data.message;
    }
  }
  return fallback;
};
