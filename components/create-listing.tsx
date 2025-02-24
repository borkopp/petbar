"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ArrowLeft, Loader2, Upload} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";

import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import Image from "next/image";
import {CategorySelection} from "@/components/create-listing/category-selection";
import {PetDetails} from "@/components/create-listing/pet-details";
import {BasicDetails} from "@/components/create-listing/basic-details";
import {BreedSelection} from "@/components/create-listing/breed-selection";
import {StepProgress} from "@/components/ui/step-progress";

const formSchema = z
  .object({
    title: z.string().min(1, "Наслов е задолжително"),
    category: z.string().min(1, "Категорија е задолжително"),
    listingType: z.enum(["sale", "adoption"], {
      required_error: "Тип на оглас е задолжително",
    }),
    breed_id: z
      .number({
        required_error: "Раса е задолжително",
        invalid_type_error: "Раса е задолжително",
      })
      .nullable(),
    breed: z.string().min(1, "Раса е задолжително"),
    age: z.string().optional().nullable(),
    gender: z.enum(["male", "female"], {
      required_error: "Пол е задолжително",
    }),
    weight: z.string().optional().nullable(),
    color: z.string().optional().default(""),
    pedigree: z.boolean().default(false),
    vaccine: z.boolean().default(false),
    description: z.string().optional().default(""),
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
      listingType: undefined,
      breed: "",
      breed_id: null,
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
    mode: "onSubmit",
  });

  const handleCategoryComplete = (data: {category: string}) => {
    form.setValue("category", data.category, {shouldValidate: false});
    setStep(2);
  };

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof z.infer<typeof formSchema>> = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["category"];
        break;
      case 2:
        fieldsToValidate = ["breed"];
        break;
      case 3:
        fieldsToValidate = ["title", "listingType", "location"];
        break;
      case 4:
        fieldsToValidate = ["gender"];
        break;
      case 5:
        fieldsToValidate = ["description"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

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
      console.log("Starting form submission...");
      console.log("Form values:", JSON.stringify(values, null, 2));

      // Validate all required fields are present
      const requiredFields = ["title", "category", "listingType", "location", "breed_id", "breed", "gender"] as const;
      const missingFields = requiredFields.filter((field) => {
        const value = values[field];
        console.log(`Checking field ${field}:`, value);
        return value === undefined || value === null || value === "";
      });

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        toast.error("Проверете ги сите полиња", {
          description: `Следните полиња се задолжителни: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Additional validation for breed_id
      if (!values.breed_id) {
        console.error("breed_id is required");
        toast.error("Проверете ги сите полиња", {
          description: "Изберете раса",
        });
        return;
      }

      // Log the exact data being sent to Supabase
      const listingData = {
        title: values.title,
        category: values.category,
        listing_type: values.listingType,
        price: values.price,
        location: values.location,
        breed_id: values.breed_id,
        age: values.age,
        gender: values.gender,
        weight: values.weight,
        color: values.color || null,
        pedigree: values.pedigree,
        vaccine: values.vaccine,
        description: values.description || null,
        user_id: user.id,
      };

      console.log("Data being sent to Supabase:", JSON.stringify(listingData, null, 2));

      // Insert the listing
      const {data: listing, error: listingError} = await supabase.from("pet_listings").insert(listingData).select().single();

      if (listingError) {
        console.error("Supabase error details:", {
          code: listingError.code,
          message: listingError.message,
          details: listingError.details,
          hint: listingError.hint,
        });
        throw new Error(`Failed to create listing: ${listingError.message}`);
      }

      console.log("Listing created successfully:", listing);

      // Upload images
      if (images.length > 0) {
        console.log(`Starting upload of ${images.length} images`);
        for (const [index, image] of images.entries()) {
          console.log(`Processing image ${index + 1}:`, {
            name: image.name,
            size: image.size,
            type: image.type,
          });

          const fileExt = image.name.split(".").pop();
          const filePath = `${listing.id}/${index}.${fileExt}`;
          console.log("Generated file path:", filePath);

          const {error: uploadError} = await supabase.storage.from("pet-images").upload(filePath, image);

          if (uploadError) {
            console.error(`Error uploading image ${index + 1}:`, {
              name: uploadError.name,
              message: uploadError.message,
            });
            throw new Error(`Failed to upload image ${index + 1}: ${uploadError.message}`);
          }

          const {
            data: {publicUrl},
          } = supabase.storage.from("pet-images").getPublicUrl(filePath);

          console.log(`Image ${index + 1} uploaded, public URL:`, publicUrl);

          // Insert image record
          const imageData = {
            listing_id: listing.id,
            url: publicUrl,
            is_primary: index === 0,
          };
          console.log(`Saving image record ${index + 1}:`, imageData);

          const {error: imageError} = await supabase.from("pet_images").insert(imageData);

          if (imageError) {
            console.error(`Error saving image record ${index + 1}:`, {
              code: imageError.code,
              message: imageError.message,
              details: imageError.details,
              hint: imageError.hint,
            });
            throw new Error(`Failed to save image record ${index + 1}: ${imageError.message}`);
          }
        }
        console.log("All images processed successfully");
      }

      console.log("Listing creation completed, redirecting to success page");
      router.push(`/create-listing/success?id=${listing.id}`);
    } catch (error) {
      console.error("=== Error Details ===");
      console.error("Error object:", error);
      let errorMessage = "Обидете се повторно подоцна.";

      if (error instanceof Error) {
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        errorMessage = error.message;
      }

      toast.error("Грешка при креирање на огласот", {
        description: errorMessage,
      });
    } finally {
      console.log("Form submission process completed");
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const steps = [
    {
      label: "Категорија",
    },
    {
      label: "Раса",
    },
    {
      label: "Детали",
    },
    {
      label: "Карактеристики",
    },
    {
      label: "Опис и Слики",
    },
    {
      label: "Потврда",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-16 p-4 pb-16 min-h-screen">
      <StepProgress currentStep={step} steps={steps} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            async (data) => {
              console.log("Form submit triggered with data:", data);
              await onSubmit(data);
            },
            (errors) => {
              console.error("Form validation errors:", errors);
              toast.error("Проверете ги сите полиња", {
                description: "Пополнете ги сите задолжителни полиња.",
              });
            }
          )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: -20}}
              transition={{duration: 0.2}}
              className="rounded-lg border p-6 shadow-lg">
              {step === 1 && <CategorySelection onComplete={handleCategoryComplete} />}
              {step === 2 && <BreedSelection />}
              {step === 3 && <BasicDetails />}
              {step === 4 && <PetDetails />}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Опис и Слики</h2>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Опис</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Внесете опис" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Label htmlFor="images">Слики</Label>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} fill className="rounded-lg object-cover" />
                        </div>
                      ))}
                      <label
                        htmlFor="images"
                        className="relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                          <Upload className="h-8 w-8" />
                          <span className="text-sm">Додади слики</span>
                        </div>
                        <input type="file" id="images" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
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
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </Button>

                {step < 6 ? (
                  <Button type="button" onClick={handleNext}>
                    Следно
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Објави оглас
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
}
