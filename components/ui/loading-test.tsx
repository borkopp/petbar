"use client";

import {useState} from "react";
import {LoadingScreen} from "@/components/ui/loading-screen";
import {Button} from "@/components/ui/button";

export function LoadingTest() {
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="container py-8 space-y-4">
      <Button
        onClick={() => {
          setShowLoading(true);
          // Automatically hide after 3 seconds
          setTimeout(() => setShowLoading(false), 3000);
        }}>
        Show Loading Screen
      </Button>

      {showLoading && <LoadingScreen />}
    </div>
  );
}
