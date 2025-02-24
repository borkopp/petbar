import * as React from "react";
import {motion} from "framer-motion";
import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Upload} from "lucide-react";
import Image from "next/image";

interface DescriptionImagesProps {
  onNext: () => void;
  images: File[];
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DescriptionImages({onNext, images, onImagesChange}: DescriptionImagesProps) {
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

  const handleNext = async () => {
    onNext();
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
            <input type="file" id="images" multiple accept="image/*" className="hidden" onChange={onImagesChange} />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="button" onClick={handleNext}>
          Следно
        </Button>
      </div>
    </motion.div>
  );
}
