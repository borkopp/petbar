import * as React from "react";
import {motion} from "framer-motion";
import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {LocationCombobox} from "@/components/ui/location-combobox";

interface BasicDetailsProps {
  onNext: () => void;
}

export function BasicDetails({onNext}: BasicDetailsProps) {
  const form = useFormContext();
  const listingType = form.watch("listingType");

  React.useEffect(() => {
    if (listingType === "adoption") {
      form.setValue("price", "0");
    }
  }, [listingType, form]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters
    let value = e.target.value.replace(/\D/g, "");

    // Limit to 9 digits (excluding country code)
    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    // Store the raw value in the form
    form.setValue("phone", value);

    // Format the display value
    if (value.length >= 3) {
      const displayValue = value.replace(/(\d{3})(\d{3})?(\d{3})?/, function (match, p1, p2, p3) {
        let formatted = p1;
        if (p2) formatted += " " + p2;
        if (p3) formatted += " " + p3;
        return formatted;
      });
      e.target.value = displayValue;
    } else {
      e.target.value = value;
    }
  };

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1},
  };

  const handleNext = async () => {
    const isValid = await form.trigger(["title", "listingType", "location"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основни информации</CardTitle>
          <CardDescription>Внесете ги основните информации за огласот</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.div variants={itemVariants}>
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
          </motion.div>

          {listingType === "sale" && (
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="price"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Цена (МКД)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Внесете цена" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="location"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Локација</FormLabel>
                  <FormControl>
                    <LocationCombobox value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="phone"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Контакт телефон</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="07X XXX XXX"
                      value={field.value || ""}
                      onChange={handlePhoneChange}
                      maxLength={11} // Account for spaces
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </CardContent>
      </Card>
      <div className="flex justify-end pt-6">
        <Button type="button" onClick={handleNext}>
          Следно
        </Button>
      </div>
    </motion.div>
  );
}
