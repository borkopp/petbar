import {LoginForm} from "@/components/login-form";
import {Metadata} from "next";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {getLocalImagePlaceholder} from "@/lib/image-utils";

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

  // Generate blur placeholder for the login background image
  let loginBgPlaceholder = {
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    width: 1380,
    height: 1500,
  };

  try {
    const placeholder = await getLocalImagePlaceholder("login-bg.png");
    if (placeholder && placeholder.blurDataURL) {
      loginBgPlaceholder = placeholder;
    }
  } catch (error) {
    console.error("Error generating login background placeholder:", error);
    // Continue with the fallback placeholder
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm redirectTo={searchParams.redirect} loginBgPlaceholder={loginBgPlaceholder} />
      </div>
    </div>
  );
}
