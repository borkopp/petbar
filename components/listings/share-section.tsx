"use client";

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Link2, Mail, Facebook, Twitter, Phone} from "lucide-react";
import {usePathname} from "next/navigation";
import {useState} from "react";

interface ShareSectionProps {
  title: string;
  id: string;
  createdAt: string;
  views?: number;
}

export default function ShareSection({title, id, createdAt, views = 0}: ShareSectionProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const url = `https://petbar.mk${pathname}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-4">
      <Separator />
      <div className="space-y-4">
        <p className="text-sm font-medium text-center">Сподели го огласот</p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full relative" onClick={handleCopyLink}>
            <Link2 className="h-5 w-5" />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Копирано!
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>
              <Mail className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href={`https://wa.me/?text=${encodedTitle} ${encodedUrl}`} target="_blank" rel="noopener noreferrer">
              <Phone className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="text-xs text-center text-muted-foreground">
          ID: {id} | Објавено: {new Date(createdAt).toLocaleDateString("mk")} | Прегледи: {views}
        </div>
      </div>
    </div>
  );
}
