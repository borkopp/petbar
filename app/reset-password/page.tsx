import {ResetPasswordForm} from "@/components/reset-password-form";
import {Card, CardContent} from "@/components/ui/card";

interface PageProps {
  params: Promise<object>;
  searchParams: Promise<object>;
}

export default async function ResetPasswordPage(props: PageProps) {
  // We don't need to use searchParams in this case, but still need to follow Next.js 15 pattern
  await props.searchParams;

  return (
    <div className="h-[92vh] flex flex-col items-center px-12 justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Ресетирајте ја вашата лозинка</h1>
          <p className="text-sm text-muted-foreground">Внесете ја вашата е-пошта и ќе ви испратиме линк за ресетирање на лозинката</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
