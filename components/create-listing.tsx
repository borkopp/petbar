"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ArrowLeft, CircleCheck, Loader2, Upload} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";

import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Progress} from "@/components/ui/progress";
import Image from "next/image";
import {CategorySelection} from "@/components/create-listing/category-selection";
import {PetDetails} from "@/components/create-listing/pet-details";
import {BasicDetails} from "@/components/create-listing/basic-details";

const formSchema = z
  .object({
    title: z.string().min(1, "Наслов е задолжително"),
    category: z.string().min(1, "Категорија е задолжително"),
    subcategory: z.string().min(1, "Поткатегорија е задолжително"),
    listingType: z.enum(["sale", "adoption"], {
      required_error: "Тип на оглас е задолжително",
    }),
    breed: z.string().min(1, "Раса е задолжително"),
    age: z.string().optional().nullable(),
    gender: z.enum(["male", "female"], {
      required_error: "Пол е задолжително",
    }),
    weight: z.string().optional().nullable(),
    color: z.string(),
    pedigree: z.boolean().default(false),
    vaccine: z.boolean().default(false),
    description: z.string(),
    price: z.string().optional().nullable(),
    location: z.string().min(1, "Локација е задолжително"),
  })
  .transform((data) => ({
    ...data,
    age: data.age ? parseInt(data.age, 10) : null,
    weight: data.weight ? parseFloat(data.weight) : null,
    price: data.price ? parseInt(data.price, 10) : null,
  }));

interface CreateListingProps {
  user: User;
}

export default function CreateListing({user}: CreateListingProps) {
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [images, setImages] = React.useState<File[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      listingType: undefined,
      breed: "",
      age: null,
      gender: undefined,
      weight: null,
      color: "",
      pedigree: false,
      vaccine: false,
      description: "",
      price: null,
      location: "",
    },
  });

  const handleCategoryComplete = (data: {category: string; subcategory: string; breed: string}) => {
    form.setValue("category", data.category, {shouldValidate: true});
    form.setValue("subcategory", data.subcategory, {shouldValidate: true});
    form.setValue("breed", data.breed, {shouldValidate: true});
    setStep(2);
  };

  const handleNext = async () => {
    const currentStepFields = {
      1: ["category", "subcategory"],
      2: ["title", "listingType", "price", "location"],
      3: ["breed", "gender", "age", "weight", "color", "pedigree", "vaccine"],
      4: ["description"],
    }[step] as Array<keyof z.infer<typeof formSchema>>;

    const isValid = await form.trigger(currentStepFields);

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Insert the listing
      const {data: listing, error: listingError} = await supabase
        .from("pet_listings")
        .insert({
          title: values.title,
          category: values.category,
          listing_type: values.listingType,
          price: values.price,
          location: values.location,
          breed: values.breed,
          age: values.age,
          gender: values.gender,
          weight: values.weight,
          color: values.color || null,
          pedigree: values.pedigree,
          vaccine: values.vaccine,
          description: values.description || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (listingError) {
        console.error("Error creating listing:", listingError);
        throw listingError;
      }

      // Upload images
      if (images.length > 0) {
        for (const [index, image] of images.entries()) {
          const fileExt = image.name.split(".").pop();
          const filePath = `${listing.id}/${index}.${fileExt}`;

          const {error: uploadError} = await supabase.storage.from("pet-images").upload(filePath, image);

          if (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw uploadError;
          }

          const {
            data: {publicUrl},
          } = supabase.storage.from("pet-images").getPublicUrl(filePath);

          // Insert image record
          const {error: imageError} = await supabase.from("pet_images").insert({
            listing_id: listing.id,
            url: publicUrl,
            is_primary: index === 0,
          });

          if (imageError) {
            console.error("Error saving image record:", imageError);
            throw imageError;
          }
        }
      }

      router.push(`/create-listing/success?id=${listing.id}`);
    } catch (error) {
      toast.error("Грешка при креирање на огласот", {
        description: "Обидете се повторно подоцна.",
      });
      if (error instanceof Error) {
        console.error("Error creating listing:", error.message);
      } else {
        console.error("Error creating listing:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="mb-8 space-y-6">
        <h1 className="text-center text-3xl font-bold">Креирај нов оглас</h1>
        <Progress value={step * 20} className="h-2" />
      </div>

      <Form {...form}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            transition={{duration: 0.2}}
            className="rounded-lg border p-6 shadow-lg">
            {step === 1 && <CategorySelection onComplete={handleCategoryComplete} />}
            {step === 2 && <BasicDetails />}
            {step === 3 && <PetDetails />}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Опис и Слики</h2>
                <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Опис</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Внесете детален опис" className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Слики</FormLabel>
                  <div className="rounded-lg border-2 border-dashed p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1 text-center">
                        <p className="text-sm text-muted-foreground">Повлечете слики тука или</p>
                        <div className="flex justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80">
                            <span>Изберете датотеки</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} fill className="rounded-lg object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Преглед и Потврда</h2>
                <div className="rounded-lg bg-muted p-6 space-y-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Наслов:</dt>
                      <dd>{form.getValues().title}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Категорија:</dt>
                      <dd className="capitalize">{form.getValues().category}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Тип на оглас:</dt>
                      <dd className="capitalize">{form.getValues().listingType === "sale" ? "Продажба" : "Вдомување"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Цена:</dt>
                      <dd>{form.getValues().price ? `${form.getValues().price} МКД` : "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Локација:</dt>
                      <dd className="capitalize">{form.getValues().location}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Раса:</dt>
                      <dd className="capitalize">{form.getValues().breed}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Возраст:</dt>
                      <dd>{form.getValues().age ? `${form.getValues().age} месеци` : "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Пол:</dt>
                      <dd className="capitalize">{form.getValues().gender === "male" ? "Машки" : "Женски"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Тежина:</dt>
                      <dd>{form.getValues().weight ? `${form.getValues().weight} кг` : "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Боја:</dt>
                      <dd>{form.getValues().color || "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Педигре:</dt>
                      <dd>{form.getValues().pedigree ? "Да" : "Не"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Вакциниран:</dt>
                      <dd>{form.getValues().vaccine ? "Да" : "Не"}</dd>
                    </div>
                  </div>

                  {form.getValues().description && (
                    <div className="space-y-2">
                      <dt className="font-medium">Опис:</dt>
                      <dd className="text-sm">{form.getValues().description}</dd>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="space-y-2">
                      <dt className="font-medium">Слики:</dt>
                      <dd className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <Image src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} fill className="rounded-lg object-cover" />
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>

              {step < 5 ? (
                <Button type="button" onClick={handleNext}>
                  Следно
                </Button>
              ) : (
                <Button type="button" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CircleCheck className=" h-4 w-4" />
                  Објави оглас
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </Form>
    </div>
  );
}
