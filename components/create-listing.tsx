"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ArrowLeft, Loader2} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";

import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {CategorySelection} from "@/components/create-listing/category-selection";
import {PetDetails} from "@/components/create-listing/pet-details";
import {BasicDetails} from "@/components/create-listing/basic-details";
import {BreedSelection} from "@/components/create-listing/breed-selection";
import {StepProgress} from "@/components/ui/step-progress";
import {DescriptionImages} from "@/components/create-listing/description-images";

// Form input schema
const formSchema = z.object({
  title: z.string().min(1, "Наслов е задолжително"),
  category: z.string().min(1, "Категорија е задолжително"),
  listingType: z.enum(["sale", "adoption"], {
    required_error: "Тип на оглас е задолжително",
  }),
  breed_id: z.number().optional().nullable(),
  breed: z.string().min(1, "Раса е задолжително"),
  age: z.string().min(1, "Возраст е задолжително"),
  gender: z.enum(["male", "female"], {
    required_error: "Пол е задолжително",
  }),
  weight: z.string().min(1, "Тежина е задолжително"),
  color: z.string().min(1, "Боја е задолжително"),
  pedigree: z.boolean().default(false),
  vaccine: z.boolean().default(false),
  description: z.string().optional(),
  price: z.string().optional().nullable(),
  location: z.string().min(1, "Локација е задолжително"),
  phone: z
    .string()
    .min(9, "Телефонскиот број мора да има 9 цифри")
    .max(11, "Телефонскиот број не може да има повеќе од 9 цифри")
    .regex(/^07[0-9\s]{7,8}$/, "Телефонскиот број мора да започне со 07"),
});

// This is the type we'll use for the form
type FormInput = z.infer<typeof formSchema>;

// This is the transformed schema that will be used for submission
const transformedSchema = formSchema.transform((data) => ({
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

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      listingType: undefined,
      breed: "",
      breed_id: null,
      age: "",
      gender: undefined,
      weight: "",
      color: "",
      pedigree: false,
      vaccine: false,
      description: "",
      price: "",
      location: "",
      phone: "",
    },
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const handleCategoryComplete = (data: {category: string}) => {
    form.setValue("category", data.category, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: false,
    });
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const onSubmit = async (values: FormInput) => {
    try {
      setIsSubmitting(true);

      // Check for required images
      if (images.length === 0) {
        toast.error("Потребна е барем една слика", {
          description: "Додадете слика за огласот",
        });
        setIsSubmitting(false);
        return;
      }

      // Transform the values using our schema
      const transformedValues = transformedSchema.parse(values);

      // Insert the listing
      const listingData = {
        title: transformedValues.title,
        category: transformedValues.category,
        listing_type: transformedValues.listingType,
        price: transformedValues.price,
        location: transformedValues.location,
        breed_id: transformedValues.breed_id,
        age: transformedValues.age,
        gender: transformedValues.gender,
        weight: transformedValues.weight,
        color: transformedValues.color || null,
        pedigree: transformedValues.pedigree,
        vaccine: transformedValues.vaccine,
        description: transformedValues.description || null,
        phone: transformedValues.phone,
        user_id: user.id,
      };

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

      // Upload images
      if (images.length > 0) {
        for (const [index, image] of images.entries()) {
          console.log(`Processing image ${index + 1}:`, {
            name: image.name,
            size: image.size,
            type: image.type,
          });

          const fileExt = image.name.split(".").pop();
          const filePath = `${listing.id}/${index}.${fileExt}`;

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

          // Insert image record
          const imageData = {
            listing_id: listing.id,
            url: publicUrl,
            is_primary: index === 0,
          };
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
      }

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
    <div className="container max-w-3xl py-10 mx-auto px-4 min-h-screen">
      <StepProgress className="hidden md:block" currentStep={step} steps={steps} />
      <div className="block md:hidden mb-6 px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Креирај оглас за продавање</h1>
        <p className="text-sm text-muted-foreground">Пополнете ги деталите подолу за да креирате оглас за продавање на вашето милениче</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            async (data) => {
              await onSubmit(data);
            },
            (errors) => {
              if (Object.keys(errors).length > 0) {
                toast.error("Проверете ги сите полиња", {
                  description: "Пополнете ги сите задолжителни полиња.",
                });
              }
            }
          )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: -20}}
              transition={{duration: 0.2}}
              className="rounded-lg bg-transparent p-6">
              {step === 1 && <CategorySelection onComplete={handleCategoryComplete} />}
              {step === 2 && <BreedSelection category={form.getValues().category} />}
              {step === 3 && <BasicDetails />}
              {step === 4 && <PetDetails />}
              {step === 5 && <DescriptionImages images={images} onImagesChange={handleImageUpload} />}
              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Преглед и потврда</h2>
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
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Назад
                  </Button>
                ) : (
                  <div></div> /* Placeholder for consistent spacing */
                )}

                {step === 6 ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Објави оглас
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={async () => {
                      // Validate the current step before proceeding
                      let isValid = true;

                      if (step === 1) {
                        // Category selection validation
                        if (!form.getValues().category) {
                          toast.error("Изберете категорија", {
                            description: "Ве молиме изберете категорија за да продолжите.",
                          });
                          isValid = false;
                        }
                      } else if (step === 2) {
                        // Breed selection validation
                        isValid = await form.trigger("breed");
                        if (!form.getValues().breed) {
                          toast.error("Изберете раса", {
                            description: "Ве молиме изберете раса за да продолжите.",
                          });
                          isValid = false;
                        }
                      } else if (step === 3) {
                        // Basic details validation
                        isValid = await form.trigger(["title", "listingType", "location", "phone"]);
                      } else if (step === 4) {
                        // Pet details validation
                        isValid = await form.trigger(["gender", "age", "weight", "color"]);

                        // Additional validation with custom error messages
                        const petDetails = form.getValues();
                        if (!petDetails.gender) {
                          toast.error("Изберете пол", {
                            description: "Полот на миленичето е задолжителен.",
                          });
                          isValid = false;
                        }
                        if (!petDetails.age) {
                          toast.error("Внесете возраст", {
                            description: "Возраста на миленичето е задолжителна.",
                          });
                          isValid = false;
                        }
                        if (!petDetails.weight) {
                          toast.error("Внесете тежина", {
                            description: "Тежината на миленичето е задолжителна.",
                          });
                          isValid = false;
                        }
                        if (!petDetails.color) {
                          toast.error("Внесете боја", {
                            description: "Бојата на миленичето е задолжителна.",
                          });
                          isValid = false;
                        }
                      } else if (step === 5) {
                        // Description and images validation
                        if (images.length === 0) {
                          toast.error("Потребна е слика", {
                            description: "Ве молиме додадете барем една слика.",
                          });
                          isValid = false;
                        }
                      }

                      // Proceed to next step if validation passed
                      if (isValid) {
                        setStep(step + 1);
                      }
                    }}>
                    Следно
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
