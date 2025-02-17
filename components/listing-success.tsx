"use client";

import {CheckCircle} from "lucide-react";
import Link from "next/link";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";

interface ListingSuccessProps {
  listingId: string;
}

export default function ListingSuccess({listingId}: ListingSuccessProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.3}}
        className="mx-auto max-w-md text-center">
        <motion.div
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="mb-6 flex justify-center">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </motion.div>

        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="space-y-4">
          <h1 className="text-3xl font-bold">Успешно Креиран Оглас!</h1>
          <p className="text-muted-foreground">Вашиот оглас е успешно објавен и сега е достапен за сите корисници.</p>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="mt-8 space-x-4">
          <Button asChild>
            <Link href={`/listings/${listingId}`}>Погледни Оглас</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Назад Дома</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
