"use client";

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {createClient} from "@/lib/supabase/client";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {toast} from "sonner";
import {Loader2, Upload} from "lucide-react";
import {useState, useEffect} from "react";
import {LocationCombobox} from "@/components/location-combobox";
import Image from "next/image";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {cn} from "@/lib/utils";

const partnerListingSchema = z.object({
  title: z.string().min(1, "Насловот е задолжителен").max(100, "Насловот не може да биде подолг од 100 карактери"),
  description: z.string().min(1, "Описот е задолжителен").max(1000, "Описот не може да биде подолг од 1000 карактери"),
  category: z.string().min(1, "Категоријата е задолжителна"),
  // User's dog information
  dog_breed: z.string().min(1, "Расата на вашето милениче е задолжителна"),
  dog_age: z.coerce.number().min(0, "Возраста мора да биде поголема од 0"),
  dog_gender: z.string().min(1, "Полот на вашето милениче е задолжителен"),
  dog_pedigree: z.boolean().default(false),
  dog_vaccinated: z.boolean().default(false),
  dog_description: z.string().optional(),
  // Partner requirements
  desired_breed: z.string().optional(),
  desired_gender: z.string().min(1, "Полот е задолжителен"),
  location: z.string().min(1, "Локацијата е задолжителна"),
  phone: z
    .string()
    .min(1, "Телефонскиот број е задолжителен")
    .regex(/^[0-9+\s()-]{6,20}$/, "Внесете валиден телефонски број"),
  pedigree_required: z.boolean().default(false),
  breeding_experience: z.string().optional(),
  vaccination_required: z.boolean().default(false),
  desired_age_range: z
    .object({
      min: z.coerce.number().min(0, "Минималната возраст мора да биде поголема од 0"),
      max: z.coerce.number().min(0, "Максималната возраст мора да биде поголема од 0"),
    })
    .optional()
    .refine((data) => !data || data.max >= data.min, {
      message: "Максималната возраст мора да биде поголема од минималната",
    }),
  is_price_negotiable: z.boolean().default(false),
  price: z.coerce.number().min(0, "Цената мора да биде поголема од 0").optional(),
  preferred_meeting_location: z.string().optional(),
});

type PartnerListingFormValues = z.infer<typeof partnerListingSchema>;

interface PartnerListingFormProps {
  userId: string;
}

export function PartnerListingForm({userId}: PartnerListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [breeds, setBreeds] = useState<{id: number; name: string}[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const supabase = createClient();

  const form = useForm<PartnerListingFormValues>({
    resolver: zodResolver(partnerListingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      // User's dog information
      dog_breed: "",
      dog_age: 0,
      dog_gender: "",
      dog_pedigree: false,
      dog_vaccinated: false,
      dog_description: "",
      // Partner requirements
      desired_breed: "",
      desired_gender: "",
      location: "",
      phone: "",
      pedigree_required: false,
      breeding_experience: "",
      vaccination_required: false,
      is_price_negotiable: false,
      desired_age_range: {
        min: 0,
        max: 0,
      },
      price: 0,
      preferred_meeting_location: "",
    },
  });

  const category = form.watch("category");

  useEffect(() => {
    const fetchBreeds = async () => {
      if (!category) {
        setBreeds([]);
        return;
      }

      const categoryId = category === "dog" ? 1 : 2;
      const {data} = await supabase.from("breeds").select("id, name").eq("category_id", categoryId).order("name");

      if (data) {
        setBreeds(data);
        // Reset breed when category changes
        form.setValue("desired_breed", "");
      }
    };

    fetchBreeds();
  }, [category, supabase, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  async function onSubmit(data: PartnerListingFormValues) {
    try {
      setIsLoading(true);
      setFormSubmitted(true);

      // Check for required images
      if (images.length === 0) {
        toast.error("Потребна е барем една слика", {
          description: "Додадете слика за огласот",
        });
        setIsLoading(false);
        return;
      }

      // Validate all required fields are filled
      const requiredFields = [
        {name: "title", label: "Наслов"},
        {name: "description", label: "Опис"},
        {name: "category", label: "Категорија"},
        {name: "dog_breed", label: "Раса на миленичето"},
        {name: "dog_age", label: "Возраст на миленичето"},
        {name: "dog_gender", label: "Пол на миленичето"},
        {name: "desired_gender", label: "Посакуван пол на партнерот"},
        {name: "location", label: "Локација"},
        {name: "phone", label: "Телефонски број"},
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = data[field.name as keyof PartnerListingFormValues];
        return !value || (typeof value === "string" && value.trim() === "") || (typeof value === "number" && value <= 0);
      });

      if (missingFields.length > 0) {
        const fieldLabels = missingFields.map((f) => f.label).join(", ");
        toast.error("Пополнете ги сите задолжителни полиња", {
          description: `Следните полиња се задолжителни: ${fieldLabels}`,
        });

        // Focus on the first missing field
        form.setFocus(missingFields[0].name as keyof PartnerListingFormValues);
        setIsLoading(false);
        return;
      }

      // Validate price if not negotiable
      if (!data.is_price_negotiable && (!data.price || data.price <= 0)) {
        toast.error("Внесете валидна цена", {
          description: "Цената мора да биде поголема од 0 или изберете 'Цена по договор'",
        });
        form.setFocus("price");
        setIsLoading(false);
        return;
      }

      // Validate age range
      if (data.desired_age_range && (data.desired_age_range.min <= 0 || data.desired_age_range.max <= 0)) {
        toast.error("Внесете валиден опсег на возраст", {
          description: "Минималната и максималната возраст мора да бидат поголеми од 0",
        });
        form.setFocus("desired_age_range.min");
        setIsLoading(false);
        return;
      }

      toast.loading("Се креира огласот...", {id: "creating-listing"});

      const {error: supabaseError, data: listing} = await supabase
        .from("partner_listings")
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();

      if (supabaseError) {
        toast.dismiss("creating-listing");
        toast.error("Грешка при креирање на огласот", {
          description: supabaseError.message,
        });
        setIsLoading(false);
        return;
      }

      // Upload images
      if (images.length > 0) {
        toast.loading("Се прикачуваат сликите...", {id: "uploading-images"});
        console.log(`Starting upload of ${images.length} images`);
        try {
          for (const [index, image] of images.entries()) {
            console.log(`Processing image ${index + 1}:`, {
              name: image.name,
              size: image.size,
              type: image.type,
            });

            const fileExt = image.name.split(".").pop();
            const filePath = `${listing.id}/${index}.${fileExt}`;
            console.log("Generated file path:", filePath);

            // Ensure user is authenticated before upload
            const {
              data: {session},
            } = await supabase.auth.getSession();

            if (!session) {
              throw new Error("User not authenticated");
            }

            const {error: uploadError} = await supabase.storage.from("partner-images").upload(filePath, image, {
              upsert: true,
              cacheControl: "3600",
            });

            if (uploadError) {
              console.error(`Error uploading image ${index + 1}:`, {
                name: uploadError.name,
                message: uploadError.message,
              });
              throw new Error(`Failed to upload image ${index + 1}: ${uploadError.message}`);
            }

            const {
              data: {publicUrl},
            } = supabase.storage.from("partner-images").getPublicUrl(filePath);

            console.log(`Image ${index + 1} uploaded, public URL:`, publicUrl);

            // Insert image record in the partner_images table
            const imageData = {
              listing_id: listing.id,
              url: publicUrl,
              is_primary: index === 0,
            };
            console.log(`Saving image record ${index + 1}:`, imageData);

            const {data: imageRecord, error: imageError} = await supabase.from("partner_images").insert(imageData).select();

            if (imageError) {
              console.error(`Error saving image record ${index + 1}:`, {
                code: imageError.code,
                message: imageError.message,
                details: imageError.details,
                hint: imageError.hint,
              });
              throw new Error(`Failed to save image record ${index + 1}: ${imageError.message || "Check Supabase logs for details"}`);
            }

            console.log(`Image record ${index + 1} saved successfully:`, imageRecord);
          }
          console.log("All images processed successfully");
          toast.dismiss("uploading-images");
        } catch (error) {
          toast.dismiss("uploading-images");
          console.error("Error processing images:", error);
          toast.error("Грешка при прикачување на сликите", {
            description: error instanceof Error ? error.message : "Неуспешно прикачување на сликите",
          });
          throw error;
        }
      }

      toast.dismiss("creating-listing");
      toast.success("Огласот е успешно креиран", {
        description: "Вашиот оглас е објавен и сега е видлив за сите корисници",
      });

      router.push("/find-partner");
      router.refresh();
    } catch (error) {
      console.error("Error creating partner listing:", error);
      toast.error("Настана грешка при креирање на огласот", {
        description: error instanceof Error ? error.message : "Обидете се повторно подоцна",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          // Only log if there are actual errors
          if (Object.keys(errors).length > 0) {
            console.error("Form validation errors:", errors);
          }

          // Mark the form as submitted to show validation errors
          setFormSubmitted(true);

          // Check which accordion sections have errors and open them
          const hasPartnerRequirementsErrors = Object.keys(errors).some((key) =>
            [
              "desired_breed",
              "desired_gender",
              "desired_age_range",
              "pedigree_required",
              "vaccination_required",
              "is_price_negotiable",
              "price",
              "breeding_experience",
              "preferred_meeting_location",
            ].includes(key)
          );

          const hasPetInfoErrors = Object.keys(errors).some((key) =>
            ["dog_breed", "dog_age", "dog_gender", "dog_pedigree", "dog_vaccinated", "dog_description"].includes(key)
          );

          // Only show toast and open accordions if there are actual errors
          const errorCount = Object.keys(errors).length;
          if (errorCount > 0) {
            toast.error(`${errorCount} ${errorCount === 1 ? "грешка" : "грешки"} во формата`, {
              description: "Проверете ги полињата означени со црвено",
            });

            // Open the accordion with errors
            if (hasPetInfoErrors) {
              document.querySelector('[data-value="pet-info"]')?.setAttribute("data-state", "open");
            }

            if (hasPartnerRequirementsErrors) {
              document.querySelector('[data-value="partner-requirements"]')?.setAttribute("data-state", "open");
            }
          }
        })}
        className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>Наслов</FormLabel>
              <FormControl>
                <Input placeholder="Внесете наслов" {...field} />
              </FormControl>
              <FormDescription>Краток и јасен наслов што ќе го опише вашето барање за партнер</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Опис</FormLabel>
              <FormControl>
                <Textarea placeholder="Внесете детален опис" {...field} />
              </FormControl>
              <FormDescription>Детален опис на вашите барања и очекувања за партнер</FormDescription>
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="pet-info" className="border rounded-lg px-4">
            <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">Информации за вашето милениче</AccordionTrigger>
            <AccordionContent className="pb-4 pt-2 space-y-6">
              <FormField
                control={form.control}
                name="dog_breed"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Раса на вашето милениче</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!category}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Изберете раса" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {breeds.map((breed) => (
                          <SelectItem key={breed.id} value={breed.name}>
                            {breed.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Изберете ја расата на вашето милениче</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dog_age"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Возраст на вашето милениче (месеци)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Внесете ја возраста на вашето милениче во месеци</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dog_gender"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Пол на вашето милениче</FormLabel>
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
                    <FormDescription>Изберете го полот на вашето милениче</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dog_pedigree"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Има педигре</FormLabel>
                      <FormDescription>Дали вашето милениче има педигре?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dog_vaccinated"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Вакцинирано</FormLabel>
                      <FormDescription>Дали вашето милениче е вакцинирано?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dog_description"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Опис на вашето милениче</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишете го вашето милениче" {...field} />
                    </FormControl>
                    <FormDescription>Внесете дополнителни информации за вашето милениче (опционално)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Слики од вашето милениче</FormLabel>
                  <span className="text-sm text-muted-foreground">Задолжително</span>
                </div>
                <div
                  className={cn(
                    "grid grid-cols-2 gap-4 md:grid-cols-3",
                    images.length === 0 && formSubmitted && "border-2 border-destructive rounded-lg p-2"
                  )}>
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} fill className="rounded-lg object-cover" />
                    </div>
                  ))}
                  <label
                    htmlFor="images"
                    className={cn(
                      "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed",
                      images.length === 0 && formSubmitted && "border-destructive"
                    )}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                      <Upload className={cn("h-8 w-8", images.length === 0 && formSubmitted && "text-destructive")} />
                      <span className={cn("text-sm", images.length === 0 && formSubmitted && "text-destructive")}>Додади слики</span>
                    </div>
                    <input type="file" id="images" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {images.length === 0 && formSubmitted && <p className="text-[0.8rem] font-medium text-destructive">Потребна е барем една слика</p>}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="partner-requirements" className="border rounded-lg px-4 mt-4">
            <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">Барања за партнер</AccordionTrigger>
            <AccordionContent className="pb-4 pt-2 space-y-6">
              <FormField
                control={form.control}
                name="desired_breed"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Посакувана раса</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!category}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Изберете раса" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {breeds.map((breed) => (
                          <SelectItem key={breed.id} value={breed.name}>
                            {breed.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Изберете ја посакуваната раса на партнерот</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desired_gender"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Посакуван пол на партнерот</FormLabel>
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
                    <FormDescription>Изберете го посакуваниот пол на партнерот</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="desired_age_range.min"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Минимална возраст (месеци)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className={form.formState.errors.desired_age_range?.min ? "border-destructive" : ""} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.desired_age_range?.min?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desired_age_range.max"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Максимална возраст (месеци)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className={form.formState.errors.desired_age_range?.max ? "border-destructive" : ""} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.desired_age_range?.max?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pedigree_required"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Потребен педигре</FormLabel>
                      <FormDescription>Дали партнерот треба да има педигре?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vaccination_required"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Потребни вакцини</FormLabel>
                      <FormDescription>Дали партнерот треба да биде вакциниран?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_price_negotiable"
                  render={({field}) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Цена по договор</FormLabel>
                        <FormDescription>Изберете доколку сакате цената да биде по договор</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!form.watch("is_price_negotiable") && (
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Цена (МКД)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className={form.formState.errors.price ? "border-destructive" : ""} />
                          </FormControl>
                          <FormMessage />
                          {!form.watch("is_price_negotiable") && !field.value && (
                            <p className="text-[0.8rem] font-medium text-destructive">
                              Цената е задолжителна кога не е избрано &quot;Цена по договор&quot;
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="breeding_experience"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Искуство со парење</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишете го вашето искуство со парење" {...field} />
                    </FormControl>
                    <FormDescription>Опишете го вашето претходно искуство со парење (опционално)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_meeting_location"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Посакувана локација за средба</FormLabel>
                    <FormControl>
                      <Input placeholder="Пр: Градски парк, Ветеринарна станица" {...field} />
                    </FormControl>
                    <FormDescription>Каде би сакале да се сретнете со потенцијалниот партнер?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <FormField
          control={form.control}
          name="location"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Локација</FormLabel>
              <LocationCombobox value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({field}) => (
            <FormItem>
              <FormLabel>Телефонски број *</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="070 123 456" {...field} className={form.formState.errors.phone ? "border-destructive" : ""} />
              </FormControl>
              <FormDescription>Вашиот телефонски број ќе биде видлив само за најавени корисници</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Објави оглас
        </Button>
      </form>
    </Form>
  );
}
