"use client";

import {useAuth} from "@/lib/context/auth-provider";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {CalendarIcon, CheckCircle2Icon, MailIcon, UserIcon} from "lucide-react";

export function UserProfile() {
  const {user, isLoading, signOut} = useAuth();

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden border-none shadow-lg">
        <div className="h-32 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url(/placeholder.png)"}} />
        <CardHeader className="-mt-12 flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarFallback>
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-3 bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full overflow-hidden border-none shadow-lg">
        <div className="h-32 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url(/placeholder.png)"}} />
        <CardHeader className="-mt-12 flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarFallback>BP</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <CardTitle className="text-xl">Не сте најавени</CardTitle>
            <CardDescription className="mt-1">Најавете се за да го видите вашиот профил</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8 flex justify-center">
          <Button asChild className="w-full max-w-xs mt-4" size="lg">
            <a href="/login">Најава</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const providerIcon = getProviderIcon(user.app_metadata?.provider);

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg">
      <div className="h-32 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url(/placeholder.png)"}} />
      <CardHeader className="-mt-12 flex flex-col items-center">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
          <AvatarFallback>BP</AvatarFallback>
        </Avatar>
        <div className="mt-4 text-center">
          <CardTitle className="text-xl">{user.user_metadata?.full_name || "Корисник"}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1 mt-1">
            <MailIcon className="h-3 w-3" />
            <span>{user.email}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <span>Информации за сметката</span>
              </h3>
              <div className="grid gap-3 bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="font-medium text-sm text-muted-foreground">Провајдер:</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {providerIcon}
                    <span className="capitalize">{translateProvider(user.app_metadata?.provider) || "е-пошта"}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="font-medium text-sm text-muted-foreground">Последна најава:</span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(user.last_sign_in_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="font-medium text-sm text-muted-foreground">Датум на регистрација:</span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(user.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-sm text-muted-foreground">Е-пошта потврдена:</span>
                  <span className={`flex items-center gap-1.5 ${user.email_confirmed_at ? "text-green-600" : "text-amber-600"}`}>
                    {user.email_confirmed_at ? (
                      <CheckCircle2Icon className="h-4 w-4" />
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    )}
                    <span>{user.email_confirmed_at ? "Да" : "Не"}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Безбедност и приватност</span>
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Вашите податоци се безбедни и заштитени. Ние никогаш не ги споделуваме вашите лични информации со трети страни без ваша согласност.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Енкриптирана комуникација</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Безбедно складирање на податоци</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="destructive" className="w-full" onClick={signOut} size="lg">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Одјава
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Н/А";

  try {
    return new Date(dateString).toLocaleDateString("mk-MK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Н/А";
  }
}

function translateProvider(provider: string | undefined): string {
  if (!provider) return "е-пошта";

  const translations: Record<string, string> = {
    google: "Google",
    apple: "Apple",
    facebook: "Facebook",
    twitter: "Twitter",
    github: "GitHub",
    email: "е-пошта",
  };

  return translations[provider.toLowerCase()] || provider;
}

function getProviderIcon(provider: string | undefined) {
  switch (provider?.toLowerCase()) {
    case "google":
      return (
        <svg className="h-4 w-4 text-[#4285F4]" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
      );
    case "apple":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
            fill="currentColor"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24">
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return <MailIcon className="h-4 w-4 text-muted-foreground" />;
  }
}
