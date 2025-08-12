import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label,
  error,
  required = false,
  children,
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required} htmlFor={props.id}>
          {label}
        </Label>
      )}
      {children || <Input error={!!error} {...props} />}
      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
};

export default FormField;