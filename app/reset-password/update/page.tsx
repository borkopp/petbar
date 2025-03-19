import { Card, CardContent } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/update-password-form";

interface PageProps {
  params: Promise<object>;
  searchParams: Promise<object>;
}

export default async function UpdatePasswordPage(props: PageProps) {
  // We don't need to use searchParams in this case, but still need to follow Next.js 15 pattern
  await props.searchParams;
  
  return (
    <div className="h-[92vh]  flex flex-col items-center px-12 justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Поставете нова лозинка</h1>
          <p className="text-sm text-muted-foreground">
            Внесете нова лозинка за вашата сметка
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 