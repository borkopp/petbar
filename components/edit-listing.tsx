"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ArrowLeft, Loader2, Save, X} from "lucide-react";
import type {User} from "@supabase/supabase-js";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

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
import {LocationCombobox} from "@/components/ui/location-combobox";
import type {Tables} from "@/database.types";
import Image from "next/image";

// Form input schema
const formSchema = z.object({
  title: z.string().min(1, "Наслов е задолжително"),
  listingType: z.enum(["sale", "adoption"], {
    required_error: "Тип на оглас е задолжително",
  }),
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

interface EditListingProps {
  user: User;
  listing: Tables<"pet_listings"> & {
    pet_images: Array<Tables<"pet_images">>;
  };
  // We no longer need breeds since we're not allowing breed selection
  // breeds: Tables<"breeds">[];
}

export default function EditListing({user, listing}: EditListingProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [existingImages, setExistingImages] = React.useState<Tables<"pet_images">[]>(listing.pet_images);
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

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: listing.title || "",
      listingType: (listing.listing_type as "sale" | "adoption") || undefined,
      age: listing.age ? String(listing.age) : "",
      gender: (listing.gender as "male" | "female") || undefined,
      weight: listing.weight ? String(listing.weight) : "",
      color: listing.color || "",
      pedigree: listing.pedigree || false,
      vaccine: listing.vaccine || false,
      description: listing.description || "",
      price: listing.price ? String(listing.price) : "",
      location: listing.location || "",
      phone: listing.phone || "",
    },
    mode: "onSubmit",
  });

  const handleBack = () => {
    router.back();
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
        listing_type: values.listingType, // Map listingType to listing_type
        age: values.age ? parseInt(values.age, 10) : null,
        gender: values.gender,
        weight: values.weight ? parseFloat(values.weight) : null,
        color: values.color,
        pedigree: values.pedigree,
        vaccine: values.vaccine,
        description: values.description,
        price: values.price ? parseInt(values.price, 10) : null,
        location: values.location,
        phone: values.phone,
        updated_at: new Date().toISOString(),
        user_id: userId,
      };

      // Log update data for debugging
      console.log("Update data:", updateData);

      // Update the listing in the database
      const {error: updateError} = await supabase.from("pet_listings").update(updateData).eq("id", listing.id);

      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }

      // Handle image deletions
      if (imagesToDelete.length > 0) {
        // Delete from storage
        for (const imageId of imagesToDelete) {
          const imageToDelete = listing.pet_images.find((img) => img.id === imageId);
          if (imageToDelete) {
            const path = imageToDelete.url.split("/").slice(-2).join("/");
            const {error: storageError} = await supabase.storage.from("pet-images").remove([path]);
            if (storageError) {
              console.error("Storage deletion error:", storageError);
            }
          }
        }

        // Delete from database
        const {error: deleteImagesError} = await supabase.from("pet_images").delete().in("id", imagesToDelete);

        if (deleteImagesError) {
          console.error("Image deletion error:", deleteImagesError);
          throw deleteImagesError;
        }
      }

      // Handle new image uploads
      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${listing.id}/${fileName}`;

          // Upload the image to storage
          const {error: uploadError} = await supabase.storage.from("pet-images").upload(filePath, file);

          if (uploadError) {
            console.error("Image upload error:", uploadError);
            throw uploadError;
          }

          // Get the public URL
          const {data: publicURL} = supabase.storage.from("pet-images").getPublicUrl(filePath);

          // Insert the image record
          const {error: insertError} = await supabase.from("pet_images").insert({
            listing_id: listing.id,
            url: publicURL.publicUrl,
            is_primary: existingImages.length === 0 && i === 0, // Make primary if it's the first image and no existing images
          });

          if (insertError) {
            console.error("Image record insertion error:", insertError);
            throw insertError;
          }
        }
      }

      toast.success("Огласот е успешно изменет!", {
        description: "Вашите промени се зачувани.",
      });

      // Redirect to the listing page
      router.push(`/listings/${listing.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Грешка при зачувување на огласот", {
        description: error instanceof Error ? error.message : "Обидете се повторно подоцна.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      // Validate file types
      const validFiles = selectedFiles.filter((file) => file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp");

      if (validFiles.length !== selectedFiles.length) {
        toast.error("Невалиден формат на слика", {
          description: "Поддржани формати: JPG, PNG, WebP",
        });
      }

      // Check total number of images (existing + new)
      if (existingImages.length + newImages.length + validFiles.length > 5) {
        toast.error("Максимален број на слики", {
          description: "Можете да додадете максимум 5 слики.",
        });
        return;
      }

      setNewImages((prev) => [...prev, ...validFiles]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: string) => {
    // Prevent deletion if this is the last image
    if (existingImages.length === 1 && newImages.length === 0) {
      toast.error("Не може да се избрише", {
        description: "Огласот мора да има барем една слика.",
      });
      return;
    }

    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setImagesToDelete((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Измени оглас</h1>
        <div className="w-[73px]"></div> {/* Spacer for centering */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Детали</TabsTrigger>
          <TabsTrigger value="images">Слики</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
            <TabsContent value="details" className="space-y-6 pb-20">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Основни информации</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Наслов</Label>
                    <Input id="title" placeholder="Внесете наслов" {...form.register("title")} className="mt-1.5" />
                    {form.formState.errors.title && <p className="mt-1 text-sm text-destructive">{form.formState.errors.title.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="listingType">Тип на оглас</Label>
                    <Select
                      value={form.watch("listingType")}
                      onValueChange={(value: "sale" | "adoption") => {
                        form.setValue("listingType", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Изберете тип на оглас" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Продажба</SelectItem>
                        <SelectItem value="adoption">Вдомување</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.listingType && (
                      <p className="mt-1 text-sm text-destructive">{form.formState.errors.listingType.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Display category as read-only */}
                  <div>
                    <Label>Категорија</Label>
                    <div className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                      {listing.category === "dogs" ? "Кучиња" : listing.category === "cats" ? "Мачки" : "Други миленици"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Категоријата не може да се промени</p>
                  </div>

                  {/* Display breed as read-only */}
                  <div>
                    <Label>Раса</Label>
                    <div className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                      {listing.breed || "Не е наведено"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Расата не може да се промени</p>
                  </div>
                </div>

                {form.watch("listingType") === "sale" && (
                  <div>
                    <Label htmlFor="price">Цена (МКД)</Label>
                    <Input id="price" type="number" placeholder="Внесете цена" {...form.register("price")} className="mt-1.5" />
                    {form.formState.errors.price && <p className="mt-1 text-sm text-destructive">{form.formState.errors.price.message}</p>}
                  </div>
                )}
              </div>

              {/* Pet Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Детали за миленикот</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="age">Возраст (месеци)</Label>
                    <Input id="age" type="number" placeholder="Внесете возраст" {...form.register("age")} className="mt-1.5" />
                    {form.formState.errors.age && <p className="mt-1 text-sm text-destructive">{form.formState.errors.age.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="gender">Пол</Label>
                    <Select
                      value={form.watch("gender")}
                      onValueChange={(value: "male" | "female") => {
                        form.setValue("gender", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Изберете пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Машки</SelectItem>
                        <SelectItem value="female">Женски</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && <p className="mt-1 text-sm text-destructive">{form.formState.errors.gender.message}</p>}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="weight">Тежина (кг)</Label>
                    <Input id="weight" type="number" step="0.1" placeholder="Внесете тежина" {...form.register("weight")} className="mt-1.5" />
                    {form.formState.errors.weight && <p className="mt-1 text-sm text-destructive">{form.formState.errors.weight.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="color">Боја</Label>
                    <Input id="color" placeholder="Внесете боја" {...form.register("color")} className="mt-1.5" />
                    {form.formState.errors.color && <p className="mt-1 text-sm text-destructive">{form.formState.errors.color.message}</p>}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="pedigree">Родословие</Label>
                      <p className="text-sm text-muted-foreground">Дали миленикот има родословие?</p>
                    </div>
                    <Switch
                      id="pedigree"
                      checked={form.watch("pedigree")}
                      onCheckedChange={(checked) => {
                        form.setValue("pedigree", checked, {
                          shouldValidate: false,
                          shouldDirty: true,
                        });
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="vaccine">Вакциниран</Label>
                      <p className="text-sm text-muted-foreground">Дали миленикот е вакциниран?</p>
                    </div>
                    <Switch
                      id="vaccine"
                      checked={form.watch("vaccine")}
                      onCheckedChange={(checked) => {
                        form.setValue("vaccine", checked, {
                          shouldValidate: false,
                          shouldDirty: true,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Контакт информации</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Локација</Label>
                    <div className="mt-1.5">
                      <LocationCombobox
                        value={form.watch("location")}
                        onChange={(value: string) => {
                          form.setValue("location", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />
                    </div>
                    {form.formState.errors.location && <p className="mt-1 text-sm text-destructive">{form.formState.errors.location.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" placeholder="07X XXX XXX" {...form.register("phone")} className="mt-1.5" />
                    {form.formState.errors.phone && <p className="mt-1 text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Опис</h3>
                <div>
                  <Textarea id="description" placeholder="Внесете опис" {...form.register("description")} className="mt-1.5 min-h-[150px]" />
                  {form.formState.errors.description && <p className="mt-1 text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6 pb-20">
              {/* Current Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Тековни слики</h3>
                <p className="text-sm text-muted-foreground">
                  Можете да избришете постоечки слики или да додадете нови. Максимален број на слики: 5.
                </p>

                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {existingImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="relative aspect-square">
                          <BlurImage
                            src={image.url}
                            alt="Pet image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            disabled={existingImages.length === 1 && newImages.length === 0}
                            title={existingImages.length === 1 && newImages.length === 0 ? "Огласот мора да има барем една слика" : "Избриши слика"}
                            className={`absolute right-2 top-2 rounded-full p-1 text-white shadow-sm transition-opacity hover:opacity-90 ${
                              existingImages.length === 1 && newImages.length === 0 ? "bg-destructive/50 cursor-not-allowed" : "bg-destructive"
                            }`}>
                            <X className="h-4 w-4" />
                          </button>
                          {image.is_primary && (
                            <div className="absolute bottom-0 left-0 right-0 bg-primary/80 p-1 text-center text-xs text-white">Главна слика</div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">Нема постоечки слики</p>
                  </div>
                )}
              </div>

              {/* New Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Додај нови слики</h3>
                <p className="text-sm text-muted-foreground">Поддржани формати: JPG, PNG, WebP. Максимален број на слики: 5.</p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Upload button */}
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      multiple
                    />
                    <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center gap-2 text-muted-foreground">
                      <div className="rounded-full bg-muted p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-upload">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Кликни за додавање слики</span>
                      <span className="text-xs">или повлечи и пушти</span>
                    </label>
                  </div>

                  {/* Preview of new images */}
                  {newImages.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Нови слики за додавање ({newImages.length})</h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {newImages.map((file, index) => (
                          <div key={index} className="relative aspect-square rounded-md border overflow-hidden">
                            <Image src={URL.createObjectURL(file)} alt={`New upload ${index + 1}`} fill className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow-sm transition-opacity hover:opacity-90">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Sticky footer with submit button */}
            <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background p-4  md:sticky">
              <div className="container flex items-center justify-between gap-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Откажи
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSubmitting ? "Зачувување..." : "Зачувај промени"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
