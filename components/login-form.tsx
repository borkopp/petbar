"use client";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {login, signInWithGoogle, signInWithApple, signInWithFacebook} from "@/app/login/actions";
import {useFormStatus} from "react-dom";
import {useState} from "react";
import {toast} from "sonner";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";
import {PasswordInput} from "@/components/ui/password-input";
import Image from "next/image";

// Helper function to translate Supabase error messages to Macedonian
function translateErrorMessage(error: string): string {
  // Map common Supabase error messages to Macedonian translations
  const errorTranslations: Record<string, string> = {
    "Invalid login credentials": "Невалидни податоци за најава",
    "Email not confirmed": "Е-поштата не е потврдена",
    "Invalid email or password": "Невалидна е-пошта или лозинка",
    "Email rate limit exceeded": "Надминат е лимитот за обиди. Обидете се повторно подоцна",
    "Password should be at least 6 characters": "Лозинката треба да има најмалку 6 карактери",
    "User not found": "Корисникот не е пронајден",
    "Too many requests": "Премногу обиди. Обидете се повторно подоцна",
  };

  // Check if the error message matches any of our known translations
  for (const [englishError, translation] of Object.entries(errorTranslations)) {
    if (error.includes(englishError)) {
      return translation;
    }
  }

  // Return the original error if no translation is found
  return error;
}

type State = {
  error: string | null;
};

const initialState: State = {
  error: null,
};

function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Најава"}
    </Button>
  );
}

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({redirectTo}: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            action={async (formData) => {
              setError(null);
              if (redirectTo) {
                formData.append("redirectTo", redirectTo);
              }
              const result = await login(initialState, formData);
              if (result?.error) {
                const macedonianError = translateErrorMessage(result.error);
                setError(macedonianError);
                toast.error("Грешка при најавување", {
                  description: macedonianError,
                });
              } else {
                toast.success("Добредојдовте назад!", {
                  description: "Успешно се најавивте на вашата сметка",
                });
                router.refresh();
                router.push(redirectTo || "/");
              }
            }}
            className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Најава 🐾</h1>
                <p className="text-balance mt-2 text-muted-foreground">Најавете се на вашата сметка</p>
              </div>
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
              <div className="grid gap-2">
                <Label htmlFor="email">Е-пошта</Label>
                <Input name="email" id="email" type="email" placeholder="ime@mail.com" required autoComplete="email" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Лозинка</Label>
                  <Link href="/reset-password" className="ml-auto text-xs underline-offset-2 hover:underline">
                    Ја заборавивте лозинката?
                  </Link>
                </div>
                <PasswordInput name="password" id="password" placeholder="••••••••" required autoComplete="current-password" />
              </div>
              <SubmitButton />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">или продолжете со</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      toast.info("Се најавувате со Apple...");
                      const result = await signInWithApple();

                      if (result?.error) {
                        const macedonianError = translateErrorMessage(result.error);
                        toast.error("Грешка при најавување со Apple", {
                          description: macedonianError,
                        });
                      } else if (result?.data?.url) {
                        // If we have a URL, redirect the user to it
                        toast.success("Пренасочување на Apple...");
                        window.location.href = result.data.url;
                      } else {
                        toast.error("Недостапен URL за најавување со Apple");
                        console.error("Missing URL in OAuth response:", result);
                      }
                    } catch (error) {
                      console.error("Грешка при најавување со Apple:", error);
                      toast.error("Неочекувана грешка при најавување со Apple");
                    }
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      toast.info("Се најавувате со Google...");
                      const result = await signInWithGoogle();

                      if (result?.error) {
                        const macedonianError = translateErrorMessage(result.error);
                        toast.error("Грешка при најавување со Google", {
                          description: macedonianError,
                        });
                      } else if (result?.data?.url) {
                        // If we have a URL, redirect the user to it
                        toast.success("Пренасочување на Google...");
                        window.location.href = result.data.url;
                      } else {
                        toast.error("Недостапен URL за најавување со Google");
                        console.error("Missing URL in OAuth response:", result);
                      }
                    } catch (error) {
                      console.error("Грешка при најавување со Google:", error);
                      toast.error("Неочекувана грешка при најавување со Google");
                    }
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      toast.info("Се најавувате со Facebook...");
                      const result = await signInWithFacebook();

                      if (result?.error) {
                        const macedonianError = translateErrorMessage(result.error);
                        toast.error("Грешка при најавување со Facebook", {
                          description: macedonianError,
                        });
                      } else if (result?.data?.url) {
                        // If we have a URL, redirect the user to it
                        toast.success("Пренасочување на Facebook...");
                        window.location.href = result.data.url;
                      } else {
                        toast.error("Недостапен URL за најавување со Facebook");
                        console.error("Missing URL in OAuth response:", result);
                      }
                    } catch (error) {
                      console.error("Грешка при најавување со Facebook:", error);
                      toast.error("Неочекувана грешка при најавување со Facebook");
                    }
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="text-[#000]">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Facebook</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Немате сметка?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Регистрирајте се
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login-bg.png"
              alt="Image"
              width={1380}
              height={1500}
              className="h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Со кликање на продолжи, се согласувате со нашите <Link href="/terms">Услови за користење</Link> и{" "}
        <Link href="/privacy">Политика за приватност</Link>.
      </div>
    </div>
  );
}
