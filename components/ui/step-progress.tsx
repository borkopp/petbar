import * as React from "react";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import {Check} from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  steps: Array<{
    label: string;
  }>;
}

export function StepProgress({currentStep, steps}: StepProgressProps) {
  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "white",
                  borderColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "hsl(var(--border))",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors", "text-sm font-medium")}
                style={{
                  color: isCompleted || isCurrent ? "white" : "hsl(var(--muted-foreground))",
                }}>
                {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
              </motion.div>
              <div className="mt-2 flex flex-col items-center">
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            </div>
          );
        })}

        {/* Progress line */}
        <div className="absolute top-5 left-[20px] right-[20px] h-[2px] -z-10 bg-muted">
          <motion.div
            className="h-full origin-left bg-primary"
            initial={{width: "0%"}}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{duration: 0.3}}
          />
        </div>
      </div>
    </div>
  );
}
