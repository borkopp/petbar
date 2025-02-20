import {LoginForm} from "@/components/login-form";
import {Metadata} from "next";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: "Најава - petbar.mk",
  description: "Најавете се на вашата сметка на petbar.mk",
};

export default async function LoginPage(props: {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  params: Promise<{}>;
  searchParams: Promise<{redirect?: string}>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.redirect || "/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm redirectTo={searchParams.redirect} />
      </div>
    </div>
  );
}
