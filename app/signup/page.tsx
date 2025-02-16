import {SignupForm} from "@/components/signup-form";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Регистрација - dogbar.mk",
  description: "Креирајте сметка на dogbar.mk",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-[1000px] mx-auto">
        <SignupForm />
      </div>
    </main>
  );
}
