import { Card, CardContent } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <div className="container min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10">
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