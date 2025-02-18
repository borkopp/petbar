"use client";

import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {toast} from "sonner";
import {createClient} from "@/lib/supabase/client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast.success("Успешно се одјавивте", {
        description: "Ви благодариме што ја користите нашата платформа",
      });
      router.refresh();
    } catch {
      toast.error("Грешка при одјавување", {
        description: "Обидете се повторно",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button variant="outline" className=" text-sm gap-2" onClick={handleLogout} disabled={isLoggingOut}>
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? "Се одјавува..." : "Одјави се"}
    </Button>
  );
}
