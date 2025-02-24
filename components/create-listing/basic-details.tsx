import * as React from "react";
import {motion} from "framer-motion";
import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

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
                    <Input placeholder="Внесете локација" {...field} />
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
