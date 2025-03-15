"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Loader2} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {LocationCombobox} from "@/components/location-combobox";
import type {Tables} from "@/database.types";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Корисничкото име мора да содржи најмалку 3 карактери",
  }),
  full_name: z.string().min(2, {
    message: "Името мора да содржи најмалку 2 карактера",
  }),
  location: z.string({
    required_error: "Изберете локација",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  profile: Tables<"profiles">;
}

export default function ProfileForm({profile}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile.username,
      full_name: profile.full_name || "",
      location: profile.location || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const {error} = await supabase
        .from("profiles")
        .update({
          username: values.username,
          full_name: values.full_name,
          location: values.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Профилот е успешно ажуриран!");
    } catch (error) {
      toast.error("Грешка при ажурирање на профилот", {
        description: "Обидете се повторно подоцна.",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Е-пошта</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground">Е-поштата не може да се промени</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Име и презиме</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({field}) => (
            <FormItem>
              <FormLabel>Локација</FormLabel>
              <FormControl>
                <LocationCombobox value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Зачувај промени
        </Button>
      </form>
    </Form>
  );
}
