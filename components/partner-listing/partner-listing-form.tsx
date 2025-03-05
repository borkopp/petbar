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

const partnerListingSchema = z.object({
  title: z.string().min(1, "Насловот е задолжителен").max(100, "Насловот не може да биде подолг од 100 карактери"),
  description: z.string().min(1, "Описот е задолжителен").max(1000, "Описот не може да биде подолг од 1000 карактери"),
  category: z.string().min(1, "Категоријата е задолжителна"),
  desired_breed: z.string().optional(),
  desired_gender: z.string().min(1, "Полот е задолжителен"),
  location: z.string().min(1, "Локацијата е задолжителна"),
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
  price_range: z
    .object({
      min: z.coerce.number().min(0, "Минималната цена мора да биде поголема од 0"),
      max: z.coerce.number().min(0, "Максималната цена мора да биде поголема од 0"),
    })
    .optional()
    .refine((data) => !data || data.max >= data.min, {
      message: "Максималната цена мора да биде поголема од минималната",
    }),
  availability_period: z.string().optional(),
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
  const supabase = createClient();

  const form = useForm<PartnerListingFormValues>({
    resolver: zodResolver(partnerListingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      desired_breed: "",
      desired_gender: "",
      location: "",
      pedigree_required: false,
      breeding_experience: "",
      vaccination_required: false,
      is_price_negotiable: false,
      desired_age_range: {
        min: 0,
        max: 0,
      },
      price_range: {
        min: 0,
        max: 0,
      },
      availability_period: "",
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

      // Check for required images
      if (images.length === 0) {
        toast.error("Потребна е барем една слика", {
          description: "Додадете слика за огласот",
        });
        setIsLoading(false);
        return;
      }

      const {error: supabaseError, data: listing} = await supabase
        .from("partner_listings")
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();

      if (supabaseError) {
        toast.error(supabaseError.message);
        return;
      }

      // Upload images
      if (images.length > 0) {
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
        } catch (error) {
          console.error("Error processing images:", error);
          throw error;
        }
      }

      toast.success("Огласот е успешно креиран");
      router.push("/find-partner");
      router.refresh();
    } catch (error) {
      console.error("Error creating partner listing:", error);
      toast.error("Настана грешка при креирање на огласот");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormDescription>Изберете го полот на вашето милениче за кое барате партнер</FormDescription>
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({field}) => (
            <FormItem>
              <FormLabel>Локација</FormLabel>
              <FormControl>
                <LocationCombobox {...field} />
              </FormControl>
              <FormMessage />
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price_range.min"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Минимална цена (МКД)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_range.max"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Максимална цена (МКД)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
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
          name="availability_period"
          render={({field}) => (
            <FormItem>
              <FormLabel>Период на достапност</FormLabel>
              <FormControl>
                <Input placeholder="Пр: 3 месеци, до крај на година" {...field} />
              </FormControl>
              <FormDescription>Колку долго барате партнер?</FormDescription>
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Слики од вашето милениче</FormLabel>
            <span className="text-sm text-muted-foreground">Задолжително</span>
          </div>
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Објави оглас
        </Button>
      </form>
    </Form>
  );
}
