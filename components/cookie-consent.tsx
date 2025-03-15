"use client";

import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import Image from "next/image";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already seen the banner
    const hasSeenBanner = localStorage.getItem("cookieBannerSeen");
    if (hasSeenBanner !== "true") {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieBannerSeen", "true");
    setShowBanner(false);
  };

  const closeBanner = () => {
    localStorage.setItem("cookieBannerSeen", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <div className="bg-white rounded-lg shadow-lg border border-amber-100 p-4 animate-slide-up relative overflow-hidden">
        <div className="flex items-start justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <Image src="/dog-cookie.svg" alt="Cookie" width={32} height={32} />
            <h3 className="font-medium text-lg">Колачиња</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeBanner}>
            <X className="h-4 w-4" />
            <span className="sr-only">Затвори</span>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4 relative z-10">
          Користиме колачиња за да ви обезбедиме најдобро искуство на нашата веб-страница. Со продолжување на користењето на оваа страница, се
          согласувате со нашата употреба на колачиња.
        </p>

        <div className="flex gap-2 justify-end relative z-10">
          <Button variant="default" size="sm" onClick={acceptCookies}>
            Разбирам
          </Button>
        </div>
      </div>
    </div>
  );
}
