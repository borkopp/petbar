import * as React from "react";
import {motion} from "framer-motion";
import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Upload} from "lucide-react";
import Image from "next/image";

interface DescriptionImagesProps {
  images: File[];
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DescriptionImages({images, onImagesChange}: DescriptionImagesProps) {
  const form = useFormContext();

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="images">Слики</Label>
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
            <input type="file" id="images" multiple accept="image/*" className="hidden" onChange={onImagesChange} />
          </label>
        </div>
      </div>
    </motion.div>
  );
}
