import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, LockKeyhole } from "lucide-react";

interface PageProps {
  params: Promise<object>;
  searchParams: Promise<object>;
}

export default async function PasswordResetSuccessPage(props: PageProps) {
  // We don't need to use searchParams in this case, but still need to follow Next.js 15 pattern
  await props.searchParams;
  
  return (
    <div className="container min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Лозинката е успешно ресетирана</h1>
                <p className="text-sm text-muted-foreground">
                  Вашата нова лозинка е поставена. Можете да се најавите со новата лозинка.
                </p>
              </div>
              <div className="pt-4 w-full">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Кон најава
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 