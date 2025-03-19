import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function VerifiedPage() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-md w-full">
        <CardContent className="p-0">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold">Сметката е активирана!</h1>
              <p className="text-muted-foreground">
                Вашата е-пошта е успешно потврдена. Сега можете да ги користите сите функционалности на нашата платформа.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <Button asChild>
                <Link href="/login">
                  Најавете се
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  Кон почетна
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 