"use client";

import { useState, useEffect } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  mounted: boolean;
}

function calculate(target: number): Omit<CountdownResult, "mounted"> {
  const difference = target - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

export function useCountdown(targetDate: string): CountdownResult {
  const [state, setState] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    mounted: false,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    setState({ ...calculate(target), mounted: true });
    const interval = setInterval(() => {
      setState({ ...calculate(target), mounted: true });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return state;
}
