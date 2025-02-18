"use client";

import {useEffect, useState} from "react";
import {LoadingScreen} from "@/components/ui/loading-screen";

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;
  return <LoadingScreen />;
}
