import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { ResendVerificationButton } from "@/components/resend-verification-button";

interface PageProps {
  params: Promise<object>;
  searchParams: Promise<{ email?: string }>;
}

export default async function VerificationPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || "";
  
  return (
    <div className=" h-[92vh] flex flex-col items-center justify-center py-10">
      <Card className="mx-auto max-w-md w-full">
        <CardContent className="p-0">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Проверете ја вашата е-пошта</h1>
              <p className="text-muted-foreground">
                Ви испративме е-порака со линк за потврда. Ве молиме проверете ја вашата е-пошта и кликнете на линкот за да ја активирате вашата сметка.
              </p>
              {email && (
                <p className="font-medium">
                  <span className="text-muted-foreground">Испратено на: </span>
                  {email}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Проверете во сандачето</p>
                    <p className="text-muted-foreground">
                      Потврдата треба да пристигне веднаш
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Проверете спам</p>
                    <p className="text-muted-foreground">
                      Понекогаш пораките за потврда завршуваат во спам
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button asChild>
                <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                  Отвори Gmail
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer">
                  Отвори Outlook
                </a>
              </Button>
              <ResendVerificationButton email={email} />
            </div>

            <div className="flex items-center justify-center">
              <Button variant="link" asChild className="gap-1 text-muted-foreground">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Врати се на почетна
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="pt-4 text-center text-xs text-muted-foreground">
        <p>
          Имате проблем? <Link href="mailto:support@petbar.mk" className="underline underline-offset-2">Контактирајте не</Link>
        </p>
      </div>
    </div>
  );
} 