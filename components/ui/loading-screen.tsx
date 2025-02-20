"use client";
import {motion} from "framer-motion";
import Image from "next/image";
export function LoadingScreen() {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{scale: 0.8, opacity: 0}}
          animate={{
            scale: [0.8, 1.1, 1],
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative">
          {/* Logo container - updated size from h-24 w-24 to h-32 w-32 */}
          <div className="relative h-32 w-32 rounded-full bg-primary/10">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
              className="absolute inset-0">
              {/* Increased dot size from h-2 w-2 to h-3 w-3 */}
              <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-primary" />
            </motion.div>
            {/* Replace this with your actual logo */}
            <div className="absolute inset-2 rounded-full bg-primary/20 p-2">
              <div className="h-full w-full rounded-full bg-primary" />
              <Image src="/dogbar-transparent.png" alt="petbar Logo" fill className="object-contain p-1" priority />
            </div>
          </div>
        </motion.div>

        {/* Increased text sizes */}
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="mt-6 text-center">
          <h2 className="font-fredoka text-2xl font-semibold text-primary">petbar.mk</h2>
          <p className="text-base text-muted-foreground flex items-center justify-center gap-0.5">
            Се вчитува
            <motion.span initial={{opacity: 0}} animate={{opacity: 1}} transition={{repeat: Infinity, duration: 0.5, delay: 0}}>
              .
            </motion.span>
            <motion.span initial={{opacity: 0}} animate={{opacity: 1}} transition={{repeat: Infinity, duration: 0.5, delay: 0.2}}>
              .
            </motion.span>
            <motion.span initial={{opacity: 0}} animate={{opacity: 1}} transition={{repeat: Infinity, duration: 0.5, delay: 0.4}}>
              .
            </motion.span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
