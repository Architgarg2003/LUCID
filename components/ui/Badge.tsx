import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-black bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-black bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-black bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: " text-foreground", // Ensure border color is correct
      },
      size: {
        default: "h-10 px-3 text-sm",  // Adjust to match Toggle size
        sm: "h-8 px-2 text-xs",     // Smaller size
        lg: "h-11 px-5 text-md",      // Larger size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };