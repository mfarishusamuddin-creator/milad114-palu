import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-input px-3.5 py-3 text-sm text-foreground placeholder:text-[#617774] transition-[border-color,box-shadow,background] focus-visible:outline-none focus-visible:border-ring focus-visible:bg-[rgba(4,16,16,0.68)] focus-visible:shadow-[0_0_0_3px_rgba(0,255,255,0.09),0_0_22px_rgba(0,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
