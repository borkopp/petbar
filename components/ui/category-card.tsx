import Image from "next/image";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface CategoryCardProps {
  icon: string;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSelected: boolean;
}

export function CategoryCard({icon, label, onClick, isSelected}: CategoryCardProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center gap-2 p-6 transition-all hover:border-primary",
        isSelected && "border-2 border-primary bg-primary/5"
      )}
      onClick={onClick}>
      <div className="relative h-16 w-16">
        <Image src={`/icons/${icon}.svg`} alt={label} fill className="object-contain" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
