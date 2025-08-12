import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  error = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 bg-surface/80 border rounded-lg text-white placeholder-gray-400 font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const errorClasses = error 
    ? "border-error focus:ring-error/50 focus:border-error" 
    : "border-gray-600 focus:ring-secondary/50 focus:border-secondary";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseClasses, errorClasses, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;