import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "medium", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-body font-medium rounded-lg transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-secondary/50",
    secondary: "bg-surface border border-secondary/30 text-gray-100 hover:bg-secondary/10 hover:border-secondary/50 hover:scale-102 focus:ring-secondary/30",
    accent: "bg-gradient-to-r from-accent to-amber-600 text-white hover:from-accent/90 hover:to-amber-600/90 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-accent/50",
    ghost: "text-gray-300 hover:text-white hover:bg-surface/50 focus:ring-secondary/30",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error/90 hover:to-red-600/90 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-error/50"
  };
  
  const sizes = {
    small: "px-3 py-2 text-sm gap-1.5",
    medium: "px-4 py-2.5 text-sm gap-2",
    large: "px-6 py-3 text-base gap-2.5"
  };

  const iconSize = {
    small: 14,
    medium: 16,
    large: 18
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={iconSize[size]} className="animate-spin" />}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={iconSize[size]} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;