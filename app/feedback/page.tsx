"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "sonner";
import {Send, Star, ThumbsUp, Lightbulb} from "lucide-react";
import Image from "next/image";
import {createClient} from "@/lib/supabase/client";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const formSchema = z.object({
  feedbackType: z.string({
    required_error: "Изберете тип на повратна информација",
  }),
  rating: z.string({
    required_error: "Изберете оценка",
  }),
  title: z.string().min(3, {
    message: "Насловот мора да содржи најмалку 3 карактери",
  }),
  message: z.string().min(10, {
    message: "Пораката мора да содржи најмалку 10 карактери",
  }),
  email: z
    .string()
    .email({
      message: "Внесете валидна е-пошта",
    })
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedbackType: "",
      rating: "",
      title: "",
      message: "",
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Get the current user (if logged in)
      const {
        data: {user},
      } = await supabase.auth.getUser();

      // Get user agent and prepare data
      const userAgent = navigator.userAgent;

      // Insert the feedback into Supabase
      const {error} = await supabase.from("feedback").insert({
        feedback_type: values.feedbackType,
        rating: values.rating,
        title: values.title,
        message: values.message,
        email: values.email || null,
        user_id: user?.id || null,
        user_agent: userAgent,
      });

      if (error) throw error;

      toast.success("Повратната информација е успешно испратена!", {
        description: "Ви благодариме за вашето мислење.",
      });

      form.reset();
    } catch (error: unknown) {
      console.error("Error submitting feedback:", error);
      toast.error("Настана грешка при испраќање на повратната информација.", {
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
          <h1 className="text-3xl font-medium">Споделете ваше мислење</h1>
        </div>

        <div className="bg-gradient-to-b from-amber-50 to-white rounded-xl p-6 md:p-8 shadow-md border border-amber-100 mb-8">
          <p className="text-lg mb-6">
            Вашето мислење е важно за нас! Помогнете ни да ја подобриме нашата платформа со споделување на вашите искуства, предлози или забелешки.
            Сите повратни информации се анонимни, освен ако не изберете да ја споделите вашата е-пошта.
          </p>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Анонимно</h3>
                  <p className="text-muted-foreground">Вашиот идентитет останува приватен</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Оценете нѐ</h3>
                  <p className="text-muted-foreground">Кажете ни колку сте задоволни</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Предложете</h3>
                  <p className="text-muted-foreground">Споделете идеи за подобрување</p>
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
              <Image src="/feedback-dog.svg" alt="Куче со ѕвезди" width={200} height={200} className="w-full h-auto max-h-64 object-contain" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-md border">
          <h2 className="text-2xl font-bold mb-6 font-fredoka">Формулар за повратна информација</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="feedbackType"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Тип на повратна информација</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете тип" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">Општо мислење</SelectItem>
                          <SelectItem value="suggestion">Предлог за подобрување</SelectItem>
                          <SelectItem value="bug">Пријава на проблем</SelectItem>
                          <SelectItem value="feature">Барање за нова функција</SelectItem>
                          <SelectItem value="other">Друго</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Оценка</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете оценка" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">Одлично (5)</SelectItem>
                          <SelectItem value="4">Многу добро (4)</SelectItem>
                          <SelectItem value="3">Добро (3)</SelectItem>
                          <SelectItem value="2">Доволно добро (2)</SelectItem>
                          <SelectItem value="1">Лошо (1)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Наслов *</FormLabel>
                    <FormControl>
                      <Input placeholder="Краток опис на вашето мислење" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Порака *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Детално опишете го вашето мислење, предлог или проблем..." className="min-h-[120px]" {...field} />
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
                    <FormLabel>Е-пошта (опционално)</FormLabel>
                    <FormControl>
                      <Input placeholder="вашата@пошта.мк" {...field} />
                    </FormControl>
                    <FormDescription>Оставете ја вашата е-пошта само ако сакате да ве контактираме во врска со вашето мислење.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Се испраќа...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Испрати повратна информација
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
