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

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Textarea} from "@/components/ui/textarea";
import {Progress} from "@/components/ui/progress";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Насловот мора да содржи најмалку 3 карактери",
  }),
  category: z.string({
    required_error: "Изберете категорија",
  }),
  listingType: z.string({
    required_error: "Изберете тип на оглас",
  }),
  price: z.string().transform((val) => (val ? Number(val) : null)),
  location: z.string({
    required_error: "Изберете локација",
  }),
  breed: z.string({
    required_error: "Изберете раса",
  }),
  age: z.string().transform((val) => (val ? Number(val) : null)),
  gender: z.string({
    required_error: "Изберете пол",
  }),
  weight: z.string().transform((val) => (val ? Number(val) : null)),
  color: z.string(),
  pedigree: z.boolean(),
  vaccine: z.boolean(),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateListingProps {
  user: User;
}

export default function CreateListing({user}: CreateListingProps) {
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [images, setImages] = React.useState<File[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      listingType: "",
      price: 0,
      location: "",
      breed: "",
      age: 0,
      gender: "",
      weight: 0,
      color: "",
      pedigree: false,
      vaccine: false,
      description: "",
    },
  });

  const handleNext = () => {
    const currentStepFields = {
      1: ["title", "category", "listingType", "price", "location"],
      2: ["breed", "gender", "age", "weight", "color", "pedigree", "vaccine"],
      3: ["description"],
    }[step] as Array<keyof FormValues>;

    const isStepValid = currentStepFields.every((field) => {
      const fieldState = form.getFieldState(field);
      return !fieldState.invalid;
    });

    if (isStepValid) {
      setStep(step + 1);
    } else {
      // Trigger validation for the current step's fields
      currentStepFields.forEach((field) => {
        form.trigger(field);
      });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Insert the listing
      const {data: listing, error: listingError} = await supabase
        .from("pet_listings")
        .insert({
          title: values.title,
          category: values.category,
          listing_type: values.listingType,
          price: values.price ? Number(values.price) : null,
          location: values.location,
          breed: values.breed,
          age: values.age ? Number(values.age) : null,
          gender: values.gender,
          weight: values.weight ? Number(values.weight) : null,
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
        <Progress value={step * 25} className="h-2" />
      </div>

      <div className="rounded-lg border p-6 shadow-lg">
        <Form {...form}>
          <form className="space-y-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Основни Информации</h2>
                <FormField
                  control={form.control}
                  name="title"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Наслов</FormLabel>
                      <FormControl>
                        <Input placeholder="Внесете наслов" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Категорија</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете категорија" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Куче</SelectItem>
                          <SelectItem value="cat">Мачка</SelectItem>
                          <SelectItem value="bird">Птица</SelectItem>
                          <SelectItem value="other">Друго</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="listingType"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Тип на оглас</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете тип на оглас" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">Продажба</SelectItem>
                          <SelectItem value="adoption">Вдомување</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Цена (МКД)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} value={field.value || ""} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете локација" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="skopje">Скопје</SelectItem>
                          <SelectItem value="bitola">Битола</SelectItem>
                          <SelectItem value="kumanovo">Куманово</SelectItem>
                          <SelectItem value="tetovo">Тетово</SelectItem>
                          <SelectItem value="ohrid">Охрид</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Детали за Миленикот</h2>
                <FormField
                  control={form.control}
                  name="breed"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Раса</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете раса" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mixed">Мешана</SelectItem>
                          <SelectItem value="purebred">Чистокрвна</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Пол</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете пол" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Машки</SelectItem>
                          <SelectItem value="female">Женски</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Возраст (месеци)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Тежина (кг)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Боја</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pedigree"
                    render={({field}) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Има педигре</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vaccine"
                    render={({field}) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Има вакцини</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
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

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Преглед и Потврда</h2>
                <div className="rounded-lg bg-muted p-6 space-y-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Наслов:</dt>
                      <dd>{form.getValues("title")}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Категорија:</dt>
                      <dd className="capitalize">{form.getValues("category")}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Тип на оглас:</dt>
                      <dd className="capitalize">{form.getValues("listingType") === "sale" ? "Продажба" : "Вдомување"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Цена:</dt>
                      <dd>{form.getValues("price") ? `${form.getValues("price")} МКД` : "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Локација:</dt>
                      <dd className="capitalize">{form.getValues("location")}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Раса:</dt>
                      <dd className="capitalize">{form.getValues("breed")}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Возраст:</dt>
                      <dd>{form.getValues("age") ? `${form.getValues("age")} месеци` : "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Пол:</dt>
                      <dd className="capitalize">{form.getValues("gender") === "male" ? "Машки" : "Женски"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Тежина:</dt>
                      <dd>{form.getValues("weight") ? `${form.getValues("weight")} кг` : "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Боја:</dt>
                      <dd>{form.getValues("color") || "Не е наведено"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Педигре:</dt>
                      <dd>{form.getValues("pedigree") ? "Да" : "Не"}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <dt className="font-medium">Вакциниран:</dt>
                      <dd>{form.getValues("vaccine") ? "Да" : "Не"}</dd>
                    </div>
                  </div>

                  {form.getValues("description") && (
                    <div className="space-y-2">
                      <dt className="font-medium">Опис:</dt>
                      <dd className="text-sm">{form.getValues("description")}</dd>
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

              {step < 4 ? (
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
          </form>
        </Form>
      </div>
    </div>
  );
}
