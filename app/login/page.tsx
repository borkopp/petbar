import {LoginForm} from "@/components/login-form";
import {Metadata} from "next";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: "Најава - dogbar.mk",
  description: "Најавете се на вашата сметка на dogbar.mk",
};

export default async function LoginPage({searchParams}: {searchParams: {redirect?: string}}) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.redirect || "/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm redirectTo={searchParams.redirect} />
      </div>
    </div>
  );
}
