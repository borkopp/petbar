"use client";

import {useState, useEffect} from "react";
import {Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {toggleBookmark, isBookmarked} from "@/app/actions";

interface BookmarkButtonProps {
  listingId: string;
  variant?: "icon" | "full";
}

export default function BookmarkButton({listingId, variant = "icon"}: BookmarkButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if the listing is bookmarked when the component mounts
    const checkBookmarkStatus = async () => {
      try {
        const result = await isBookmarked(listingId);
        if (result.needsAuth) {
          // If the user is not logged in, do nothing
          return;
        }
        setBookmarked(result.isBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [listingId]);

  const handleBookmark = async () => {
    setIsLoading(true);
    try {
      const result = await toggleBookmark(listingId);

      if (result.needsAuth) {
        toast.error("Треба да бидете најавени", {
          description: "Најавете се за да зачувате оглас во омилени",
          action: {
            label: "Најави се",
            onClick: () => router.push(`/login?redirect=/listings/${listingId}`),
          },
        });
        return;
      }

      if (result.success) {
        const newBookmarkedState = result.action === "added";
        setBookmarked(newBookmarkedState);

        toast.success(newBookmarkedState ? "Зачувано во омилени" : "Отстрането од омилени");
      } else if (result.error) {
        toast.error("Грешка", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Грешка", {
        description: "Се појави грешка при зачувувањето",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <Button variant="outline" className="w-full" onClick={handleBookmark} disabled={isLoading}>
        <Heart className={`mr-2 h-5 w-5 ${bookmarked ? "fill-current text-red-500" : ""}`} />
        {bookmarked ? "Зачувано во омилени" : "Зачувај во омилени"}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" className="h-[52px] w-[52px]" onClick={handleBookmark} disabled={isLoading}>
      <Heart className={`h-5 w-5 ${bookmarked ? "fill-current text-red-500" : ""}`} />
    </Button>
  );
}
