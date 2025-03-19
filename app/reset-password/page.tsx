
import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col h-screen  items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-md">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Ресетирајте ја вашата лозинка</h1>
          <p className="text-sm text-muted-foreground">
            Внесете ја вашата е-пошта и ќе ви испратиме линк за ресетирање на лозинката
          </p>
        </div>
            <ResetPasswordForm />

   
      </div>
    </div>
  );
} 