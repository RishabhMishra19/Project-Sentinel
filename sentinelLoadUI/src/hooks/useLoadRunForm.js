import { useState } from "react";
import { toInstant } from "../utils/dateUtils";

const getDefaultValues = () => {
  const now = new Date();

  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(
    threeMonthsAgo.getMonth() - 3
  );

  return {
    targetRps: 100,
    concurrency: 10,
    durationSeconds: 60,

    minLatencyMs: 50,
    maxLatencyMs: 500,

    failureRatePercentage: 0,

    minRequestOccurredAtTime:
      toDateInputValue(threeMonthsAgo),

    maxRequestOccurredAtTime:
      toDateInputValue(now),
  };
};

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const useLoadRunForm = () => {
  const [formData, setFormData] =
    useState(getDefaultValues);

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    const targetRps =
      Number(formData.targetRps);

    const concurrency =
      Number(formData.concurrency);

    const durationSeconds =
      Number(formData.durationSeconds);

    const minLatencyMs =
      Number(formData.minLatencyMs);

    const maxLatencyMs =
      Number(formData.maxLatencyMs);

    const failureRate =
      Number(formData.failureRatePercentage);

    if (targetRps < 1) {
      nextErrors.targetRps =
        "Must be at least 1";
    }

    if (concurrency < 1) {
      nextErrors.concurrency =
        "Must be at least 1";
    }

    if (durationSeconds < 1) {
      nextErrors.durationSeconds =
        "Must be at least 1 second";
    }

    if (minLatencyMs < 0) {
      nextErrors.minLatencyMs =
        "Cannot be negative";
    }

    if (maxLatencyMs < 0) {
      nextErrors.maxLatencyMs =
        "Cannot be negative";
    }

    if (maxLatencyMs < minLatencyMs) {
      nextErrors.maxLatencyMs =
        "Must be greater than min latency";
    }

    if (
      failureRate < 0 ||
      failureRate > 100
    ) {
      nextErrors.failureRatePercentage =
        "Must be between 0 and 100";
    }

    if (
      !formData.minRequestOccurredAtTime
    ) {
      nextErrors.minRequestOccurredAtTime =
        "Required";
    }

    if (
      !formData.maxRequestOccurredAtTime
    ) {
      nextErrors.maxRequestOccurredAtTime =
        "Required";
    }

    if (
      formData.minRequestOccurredAtTime &&
      formData.maxRequestOccurredAtTime &&
      formData.minRequestOccurredAtTime >
      formData.maxRequestOccurredAtTime
    ) {
      nextErrors.maxRequestOccurredAtTime =
        "Must be after minimum date";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const getRequest = () => {
    return {
      targetRps:
        Number(formData.targetRps),

      concurrency:
        Number(formData.concurrency),

      durationSeconds:
        Number(formData.durationSeconds),

      minLatencyMs:
        Number(formData.minLatencyMs),

      maxLatencyMs:
        Number(formData.maxLatencyMs),

      failureRatePercentage:
        Number(
          formData.failureRatePercentage
        ),

      minRequestOccurredAtTime:
        toInstant(
          formData.minRequestOccurredAtTime
        ),

      maxRequestOccurredAtTime:
        toInstant(
          formData.maxRequestOccurredAtTime
        ),
    };
  };

  const reset = () => {
    setFormData(getDefaultValues());
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    getRequest,
    reset,
  };
};

