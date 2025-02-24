"use client";

import * as React from "react";
import {motion} from "framer-motion";
import {useFormContext} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface PetDetailsProps {
  onNext: () => void;
}

export function PetDetails({onNext}: PetDetailsProps) {
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

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1},
  };

  const handleNext = async () => {
    const isValid = await form.trigger("gender");
    if (isValid) {
      onNext();
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Карактеристики</CardTitle>
          <CardDescription>Внесете ги карактеристиките на вашето милениче</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="gender"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Пол</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="age"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Возраст (месеци)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Внесете возраст" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="weight"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Тежина (кг)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Внесете тежина" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="color"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Боја</FormLabel>
                  <FormControl>
                    <Input placeholder="Внесете боја" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="pedigree"
              render={({field}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Педигре</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="vaccine"
              render={({field}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Вакциниран</FormLabel>
                  </div>
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
