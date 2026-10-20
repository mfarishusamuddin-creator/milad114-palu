import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full rounded-lg border border-border bg-input px-3.5 py-3 text-sm text-foreground placeholder:text-[#617774] transition-[border-color,box-shadow,background] focus-visible:outline-none focus-visible:border-ring focus-visible:bg-[rgba(4,16,16,0.68)] focus-visible:shadow-[0_0_0_3px_rgba(0,255,255,0.09),0_0_22px_rgba(0,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
