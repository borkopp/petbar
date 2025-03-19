"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowRight, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/reset-password/actions";

const formSchema = z.object({
  email: z.string().email("Внесете валидна е-пошта"),
});

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(data.email);

      if (result.error) {
        toast.error("Грешка", {
          description: result.error,
        });
        return;
      }

      setIsSubmitted(true);
      setEmailSent(data.email);
      toast.success("Е-поштата е испратена", {
        description: "Проверете ја вашата е-пошта за линк за ресетирање на лозинката",
      });
    } catch {
      toast.error("Грешка", {
        description: "Се случи грешка при испраќање на барањето. Обидете се повторно подоцна.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="rounded-lg border shadow-sm p-8">
          {/* Icon and Header Section */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Проверете ја вашата е-пошта
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Испративме линк за ресетирање на лозинката на{" "}
                <br />
                <span className="font-medium ">{emailSent}</span>.
                <br />
                Проверете ја вашата е-пошта и следете ги инструкциите.
              </p>
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Не ја добивте пораката? Проверете го спам фолдерот или
            </p>
            <Button 
              variant="link" 
              onClick={() => setIsSubmitted(false)} 
              className="px-0 font-semibold text-primary hover:text-primary/90"
            >
              обидете се со друга е-пошта
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="link" asChild className="gap-1 text-muted-foreground">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Назад кон најава
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Е-пошта</FormLabel>
              <FormControl>
                <Input 
                  placeholder="вашата@пошта.мк" 
                  type="email" 
                  autoComplete="email" 
                  disabled={isLoading} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Се испраќа...
            </>
          ) : (
            <>
              Испрати линк за ресетирање
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
          Назад кон најава
        </Link>
      </div>
    </Form>
  );
} 