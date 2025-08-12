import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ 
  children,
  required = false,
  className,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn("block text-sm font-body font-medium text-gray-200 mb-2", className)}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;