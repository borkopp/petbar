"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "sonner";
import {Mail, Phone, Send, MessageSquare} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Името мора да содржи најмалку 2 карактери.",
  }),
  email: z.string().email({
    message: "Внесете валидна е-пошта.",
  }),
  phone: z.string().optional(),
  message: z.string().min(10, {
    message: "Пораката мора да содржи најмалку 10 карактери.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful submission
      console.log("Form submitted with values:", values);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Пораката е успешно испратена! Ви благодариме.", {
        description: "Ќе ве контактираме наскоро.",
      });

      form.reset();
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      toast.error("Настана грешка при испраќање на пораката.", {
        description: "Обидете се повторно подоцна.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container font-rubik mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-medium ">Контактирајте нѐ</h1>
        </div>

        <div className="bg-gradient-to-b from-amber-50 to-white rounded-xl p-6 md:p-8 shadow-md border border-amber-100 mb-8">
          <p className="text-lg mb-6">
            Имате неодговорени прашања? Потребна ви е помош со нашата платформа? Нашиот тим е секогаш тука да ви помогне! Пополнете го формуларот
            подолу и ќе ве контактираме наскоро.
          </p>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Е-пошта</h3>
                  <p className="text-muted-foreground">contact@petbar.mk</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Телефон</h3>
                  <p className="text-muted-foreground">078 225 147</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Одговор</h3>
                  <p className="text-muted-foreground">Во рок од 24 часа</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div
                className="absolute -top-6 -right-6 w-24 h-24 bg-contain bg-no-repeat opacity-20"
                style={{backgroundImage: "url('/paw-print.svg')"}}></div>
              <div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-contain bg-no-repeat opacity-20"
                style={{backgroundImage: "url('/paw-print.svg')"}}></div>
              <Image src="/contact-dog.svg" alt="Куче со писмо" width={200} height={200} className="w-full h-auto max-h-64 object-contain" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-md border">
          <h2 className="text-2xl font-bold mb-6 font-fredoka">Испратете ни порака</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Име и презиме</FormLabel>
                      <FormControl>
                        <Input placeholder="Вашето име и презиме" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Е-пошта</FormLabel>
                      <FormControl>
                        <Input placeholder="вашата@пошта.мк" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Телефон (опционално)</FormLabel>
                    <FormControl>
                      <Input placeholder="+389 7X XXX XXX" {...field} />
                    </FormControl>
                    <FormDescription>Ќе ве контактираме само ако е потребно.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Порака</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишете го вашето прашање или проблем..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Се испраќа...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Испрати порака
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
