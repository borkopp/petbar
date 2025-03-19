"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/reset-password/actions";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Лозинката мора да содржи најмалку 8 карактери")
      .regex(/[A-Z]/, "Лозинката мора да содржи најмалку една голема буква")
      .regex(/[a-z]/, "Лозинката мора да содржи најмалку една мала буква")
      .regex(/[0-9]/, "Лозинката мора да содржи најмалку една цифра"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Лозинките не се совпаѓаат",
    path: ["confirmPassword"],
  });

export function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await updatePassword(data.password);

      if (result.error) {
        toast.error("Грешка", {
          description: result.error,
        });
        return;
      }

      setIsSuccess(true);
      toast.success("Лозинката е успешно променета", {
        description: "Сега можете да се најавите со вашата нова лозинка",
      });
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push("/reset-password/success");
      }, 2000);
    } catch {
      toast.error("Грешка", {
        description: "Се случи грешка при промена на лозинката. Обидете се повторно подоцна.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg border p-6 shadow-sm space-y-4">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Лозинката е променета!</h3>
          <p className="text-sm text-muted-foreground">
            Вашата лозинка е успешно ресетирана. Сега ќе бидете пренасочени кон страницата за најава.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <p className="font-medium">Безбедносно барање</p>
          </div>
          <p className="mt-1 text-xs text-amber-800/70 dark:text-amber-500/70">
            Лозинката мора да содржи најмалку 8 карактери, една голема буква, една мала буква и една цифра.
          </p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нова лозинка</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Потврди нова лозинка</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Се процесира...
            </>
          ) : (
            "Промени лозинка"
          )}
        </Button>
      </form>
    </Form>
  );
} 