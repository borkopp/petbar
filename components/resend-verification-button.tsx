"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/app/signup/verification/actions";

interface ResendVerificationButtonProps {
  email?: string;
  className?: string;
}

export function ResendVerificationButton({ email = "", className }: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        toast.success("Е-порака за потврда испратена", {
          description: "Проверете ја вашата е-пошта и кликнете на линкот за да ја потврдите вашата сметка.",
        });
      } else {
        toast.error("Грешка при испраќање", {
          description: result.error || "Обидете се повторно подоцна",
        });
      }
    } catch {
      toast.error("Неуспешно испраќање", {
        description: "Се случи грешка. Обидете се повторно подоцна.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={`gap-1 ${className}`} 
      onClick={handleResend}
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Испраќање..." : "Испрати повторно"}
    </Button>
  );
} 