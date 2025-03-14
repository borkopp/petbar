"use client";

import {Loader2, LogOut} from "lucide-react";
import {toast} from "sonner";
import {createClient} from "@/lib/supabase/client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "./ui/button";

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
    <Button className="flex items-center text-red-500 " variant={"ghost"} onClick={handleLogout} disabled={isLoggingOut}>
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : "Одјави се"}
    </Button>
  );
}
