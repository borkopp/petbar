import * as React from "react";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import {Check} from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  steps: Array<{
    label: string;
  }>;
  className?: string;
}

export function StepProgress({currentStep, steps, className}: StepProgressProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative">
        {/* Progress line */}
        <div
          className="absolute top-5 left-1/2 right-1/2 h-[2px] bg-muted"
          style={
            {
              left: "calc(50% / var(--step-count))",
              right: "calc(50% / var(--step-count))",
              "--step-count": steps.length,
            } as React.CSSProperties
          }>
          <motion.div
            className="h-full origin-left bg-primary"
            initial={{width: "0%"}}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{duration: 0.3}}
          />
        </div>

        {/* Steps */}
        <div className="relative grid" style={{gridTemplateColumns: `repeat(${steps.length}, 1fr)`}}>
          {steps.map((step, index) => {
            const isCompleted = currentStep > index + 1;
            const isCurrent = currentStep === index + 1;

            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "white",
                    borderColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "hsl(var(--border))",
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors",
                    "text-sm font-medium"
                  )}
                  style={{
                    color: isCompleted || isCurrent ? "white" : "hsl(var(--muted-foreground))",
                  }}>
                  {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                </motion.div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
