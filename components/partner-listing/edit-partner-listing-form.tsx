"use client";

import * as React from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ArrowLeft, Loader2, Save, Upload as UploadIcon, X} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Card} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BlurImage} from "@/components/ui/blur-image";
import {LocationCombobox} from "@/components/location-combobox";
import type {Tables} from "@/database.types";
import Image from "next/image";

// Form input schema
const formSchema = z.object({
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

// This is the type we'll use for the form
type FormInput = z.infer<typeof formSchema>;

interface EditPartnerListingFormProps {
  user: User;
  listing: Tables<"partner_listings"> & {
    partner_images: Array<Tables<"partner_images">>;
  };
}

export default function EditPartnerListingForm({user, listing}: EditPartnerListingFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [existingImages, setExistingImages] = React.useState<Tables<"partner_images">[]>(listing.partner_images);
  const [imagesToDelete, setImagesToDelete] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("details");
  const router = useRouter();
  const supabase = createClient();

  // Use the user ID in the component
  const userId = user.id;

  // Log listing data for debugging
  React.useEffect(() => {
    console.log("Listing data:", listing);
  }, [listing]);

  // Parse desired_age_range from JSON if it exists
  const desiredAgeRange = React.useMemo(() => {
    if (listing.desired_age_range) {
      try {
        const parsed = typeof listing.desired_age_range === "string" ? JSON.parse(listing.desired_age_range as string) : listing.desired_age_range;
        return {
          min: parsed.min || 0,
          max: parsed.max || 0,
        };
      } catch (e) {
        console.error("Error parsing desired_age_range:", e);
        return {min: 0, max: 0};
      }
    }
    return {min: 0, max: 0};
  }, [listing.desired_age_range]);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: listing.title || "",
      description: listing.description || "",
      category: listing.category || "",
      // User's dog information
      dog_breed: listing.dog_breed || "",
      dog_age: listing.dog_age || 0,
      dog_gender: listing.dog_gender || "",
      dog_pedigree: listing.dog_pedigree || false,
      dog_vaccinated: listing.dog_vaccinated || false,
      dog_description: listing.dog_description || "",
      // Partner requirements
      desired_breed: listing.desired_breed || "",
      desired_gender: listing.desired_gender || "",
      location: listing.location || "",
      phone: listing.phone || "",
      pedigree_required: listing.pedigree_required || false,
      breeding_experience: listing.breeding_experience || "",
      vaccination_required: listing.vaccination_required || false,
      desired_age_range: desiredAgeRange,
      is_price_negotiable: listing.is_price_negotiable || false,
      price: listing.price || 0,
      preferred_meeting_location: listing.preferred_meeting_location || "",
    },
    mode: "onSubmit",
  });

  const category = form.watch("category");

  // Fetch breeds when category changes
  React.useEffect(() => {
    const fetchBreeds = async () => {
      if (!category) {
        return;
      }

      const categoryId = category === "dog" ? 1 : 2;
      await supabase.from("breeds").select("id, name").eq("category_id", categoryId).order("name");
    };

    fetchBreeds();
  }, [category, supabase]);

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (imageId: string) => {
    // Check if this would be the last image (considering both existing and new images)
    if (existingImages.length + newImages.length <= 1) {
      toast.error("Не може да се избрише последната слика", {
        description: "Потребна е барем една слика за огласот.",
      });
      return;
    }
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  const removeNewImage = (index: number) => {
    // Check if this would be the last image (considering both existing and new images)
    if (existingImages.length + newImages.length <= 1) {
      toast.error("Не може да се избрише последната слика", {
        description: "Потребна е барем една слика за огласот.",
      });
      return;
    }
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormInput) => {
    try {
      // Check if there will be at least one image after the update
      if (existingImages.length === 0 && newImages.length === 0) {
        toast.error("Потребна е барем една слика", {
          description: "Додадете барем една слика за вашиот оглас.",
        });
        setActiveTab("images");
        return;
      }

      setIsSubmitting(true);

      // Log form values for debugging
      console.log("Form values:", values);

      // Create the update object with the correct field names
      const updateData = {
        title: values.title,
        description: values.description,
        category: values.category,
        // User's dog information
        dog_breed: values.dog_breed,
        dog_age: values.dog_age,
        dog_gender: values.dog_gender,
        dog_pedigree: values.dog_pedigree,
        dog_vaccinated: values.dog_vaccinated,
        dog_description: values.dog_description,
        // Partner requirements
        desired_breed: values.desired_breed,
        desired_gender: values.desired_gender,
        location: values.location,
        phone: values.phone,
        pedigree_required: values.pedigree_required,
        breeding_experience: values.breeding_experience,
        vaccination_required: values.vaccination_required,
        desired_age_range: values.desired_age_range,
        is_price_negotiable: values.is_price_negotiable,
        price: values.price,
        preferred_meeting_location: values.preferred_meeting_location,
        updated_at: new Date().toISOString(),
        user_id: userId,
      };

      // Log update data for debugging
      console.log("Update data:", updateData);

      // Update the listing in the database
      const {error: updateError} = await supabase.from("partner_listings").update(updateData).eq("id", listing.id);

      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }

      // Handle image deletions
      if (imagesToDelete.length > 0) {
        // Delete from storage
        for (const imageId of imagesToDelete) {
          const imageToDelete = listing.partner_images.find((img) => img.id === imageId);
          if (imageToDelete) {
            const path = imageToDelete.url.split("/").slice(-2).join("/");
            const {error: storageError} = await supabase.storage.from("partner-images").remove([path]);
            if (storageError) {
              console.error("Storage deletion error:", storageError);
            }
          }
        }

        // Delete from database
        const {error: deleteImagesError} = await supabase.from("partner_images").delete().in("id", imagesToDelete);

        if (deleteImagesError) {
          console.error("Image deletion error:", deleteImagesError);
          throw deleteImagesError;
        }
      }

      // Handle new image uploads
      if (newImages.length > 0) {
        for (const [index, image] of newImages.entries()) {
          const fileExt = image.name.split(".").pop();
          const filePath = `${listing.id}/${Date.now()}-${index}.${fileExt}`;

          // Upload image to storage
          const {error: uploadError} = await supabase.storage.from("partner-images").upload(filePath, image, {
            upsert: true,
          });

          if (uploadError) {
            console.error("Image upload error:", uploadError);
            throw uploadError;
          }

          // Get public URL
          const {data: publicUrlData} = supabase.storage.from("partner-images").getPublicUrl(filePath);

          // Insert image record in database
          const {error: insertImageError} = await supabase.from("partner_images").insert({
            listing_id: listing.id,
            url: publicUrlData.publicUrl,
            is_primary: index === 0 && existingImages.length === 0, // Set as primary if it's the first image and no existing images
          });

          if (insertImageError) {
            console.error("Image insert error:", insertImageError);
            throw insertImageError;
          }
        }
      }

      toast.success("Огласот е успешно ажуриран", {
        description: "Вашиот оглас е успешно ажуриран.",
      });

      // Redirect to the listing page
      router.push(`/find-partner/${listing.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Грешка при ажурирање на огласот", {
        description: "Обидете се повторно подоцна.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Измени оглас за партнер</h1>
        <div className="w-24" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Детали</TabsTrigger>
          <TabsTrigger value="images">Слики</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="details" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Наслов</Label>
                    <Input id="title" placeholder="Внесете наслов" {...form.register("title")} className="mt-1.5" />
                    {form.formState.errors.title && <p className="mt-1 text-sm text-destructive">{form.formState.errors.title.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Опис</Label>
                    <Textarea id="description" placeholder="Внесете опис" {...form.register("description")} className="mt-1.5 min-h-32" />
                    {form.formState.errors.description && (
                      <p className="mt-1 text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Категорија</Label>
                    <div className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                      {listing.category === "dog" ? "Куче" : "Мачка"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Категоријата не може да се промени</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="dog_breed">Раса на вашето милениче</Label>
                      <Input id="dog_breed" placeholder="Внесете раса" {...form.register("dog_breed")} className="mt-1.5" />
                      {form.formState.errors.dog_breed && <p className="mt-1 text-sm text-destructive">{form.formState.errors.dog_breed.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="dog_age">Возраст на вашето милениче</Label>
                      <Input id="dog_age" type="number" placeholder="Внесете возраст" {...form.register("dog_age")} className="mt-1.5" />
                      {form.formState.errors.dog_age && <p className="mt-1 text-sm text-destructive">{form.formState.errors.dog_age.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="dog_gender">Пол на вашето милениче</Label>
                      <Select value={form.watch("dog_gender")} onValueChange={(value) => form.setValue("dog_gender", value)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Изберете пол" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Машко</SelectItem>
                          <SelectItem value="female">Женско</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.dog_gender && (
                        <p className="mt-1 text-sm text-destructive">{form.formState.errors.dog_gender.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="desired_gender">Посакуван пол на партнерот</Label>
                      <Select value={form.watch("desired_gender")} onValueChange={(value) => form.setValue("desired_gender", value)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Изберете пол" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Машко</SelectItem>
                          <SelectItem value="female">Женско</SelectItem>
                          <SelectItem value="any">Било кој</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.desired_gender && (
                        <p className="mt-1 text-sm text-destructive">{form.formState.errors.desired_gender.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="desired_breed">Посакувана раса на партнерот</Label>
                      <Input id="desired_breed" placeholder="Внесете раса" {...form.register("desired_breed")} className="mt-1.5" />
                      {form.formState.errors.desired_breed && (
                        <p className="mt-1 text-sm text-destructive">{form.formState.errors.desired_breed.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location">Локација</Label>
                      <LocationCombobox value={form.watch("location")} onChange={(value) => form.setValue("location", value)} className="mt-1.5" />
                      {form.formState.errors.location && <p className="mt-1 text-sm text-destructive">{form.formState.errors.location.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Телефонски број</Label>
                      <Input id="phone" placeholder="Внесете телефонски број" {...form.register("phone")} className="mt-1.5" />
                      {form.formState.errors.phone && <p className="mt-1 text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="preferred_meeting_location">Преферирана локација за средба</Label>
                      <Input
                        id="preferred_meeting_location"
                        placeholder="Внесете локација"
                        {...form.register("preferred_meeting_location")}
                        className="mt-1.5"
                      />
                      {form.formState.errors.preferred_meeting_location && (
                        <p className="mt-1 text-sm text-destructive">{form.formState.errors.preferred_meeting_location.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dog_pedigree"
                        checked={form.watch("dog_pedigree")}
                        onCheckedChange={(checked) => form.setValue("dog_pedigree", checked)}
                      />
                      <Label htmlFor="dog_pedigree">Моето милениче има педигре</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dog_vaccinated"
                        checked={form.watch("dog_vaccinated")}
                        onCheckedChange={(checked) => form.setValue("dog_vaccinated", checked)}
                      />
                      <Label htmlFor="dog_vaccinated">Моето милениче е вакцинирано</Label>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pedigree_required"
                        checked={form.watch("pedigree_required")}
                        onCheckedChange={(checked) => form.setValue("pedigree_required", checked)}
                      />
                      <Label htmlFor="pedigree_required">Потребно е педигре</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vaccination_required"
                        checked={form.watch("vaccination_required")}
                        onCheckedChange={(checked) => form.setValue("vaccination_required", checked)}
                      />
                      <Label htmlFor="vaccination_required">Потребна е вакцинација</Label>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label>Посакуван опсег на возраст</Label>
                      <div className="grid grid-cols-2 gap-4 mt-1.5">
                        <div>
                          <Input
                            type="number"
                            placeholder="Мин"
                            value={form.watch("desired_age_range.min")}
                            onChange={(e) => form.setValue("desired_age_range.min", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Макс"
                            value={form.watch("desired_age_range.max")}
                            onChange={(e) => form.setValue("desired_age_range.max", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      {form.formState.errors.desired_age_range && (
                        <p className="mt-1 text-sm text-destructive">{form.formState.errors.desired_age_range.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="breeding_experience">Искуство со размножување</Label>
                      <Input id="breeding_experience" placeholder="Внесете искуство" {...form.register("breeding_experience")} className="mt-1.5" />
                      {form.formState.errors.breeding_experience && (
                        <p className="mt-1 text-sm text-destructive">{form.formState.errors.breeding_experience.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_price_negotiable"
                        checked={form.watch("is_price_negotiable")}
                        onCheckedChange={(checked) => form.setValue("is_price_negotiable", checked)}
                      />
                      <Label htmlFor="is_price_negotiable">Цена по договор</Label>
                    </div>

                    {!form.watch("is_price_negotiable") && (
                      <div>
                        <Label htmlFor="price">Цена (МКД)</Label>
                        <Input id="price" type="number" placeholder="Внесете цена" {...form.register("price")} className="mt-1.5" />
                        {form.formState.errors.price && <p className="mt-1 text-sm text-destructive">{form.formState.errors.price.message}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label>Постоечки слики</Label>
                    {existingImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {existingImages.map((image) => (
                          <div key={image.id} className="relative group aspect-square rounded-md overflow-hidden border">
                            <BlurImage
                              src={image.url}
                              alt="Listing image"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-2">Нема постоечки слики</p>
                    )}
                  </div>

                  <div>
                    <Label>Додади нови слики</Label>
                    <div className="mt-2">
                      <Label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-background hover:bg-accent/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon className="h-6 w-6 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Кликнете за да додадете слики</p>
                        </div>
                        <input id="images" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </Label>
                    </div>

                    {newImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {newImages.map((image, index) => (
                          <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`New image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Се зачувува...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Зачувај промени
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
