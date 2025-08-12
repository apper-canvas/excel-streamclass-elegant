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
  type = "text",
  options = [],
  ...props 
}) => {
  const renderInput = () => {
    if (children) return children;
    
    switch (type) {
      case "select":
        return (
          <select 
            className={cn(
              "w-full px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-gray-100 font-body",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              error && "border-error focus:ring-error/50 focus:border-error"
            )}
            {...props}
          >
            <option value="">Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea 
            className={cn(
              "w-full px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-gray-100 font-body",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "resize-none min-h-[100px]",
              error && "border-error focus:ring-error/50 focus:border-error"
            )}
            {...props}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary bg-surface border-secondary/30 rounded focus:ring-primary/50"
              {...props}
            />
            {label && <span className="text-gray-100 font-body text-sm">{label}</span>}
          </div>
        );
      default:
        return <Input type={type} error={!!error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && type !== "checkbox" && (
        <Label required={required} htmlFor={props.id}>
          {label}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
};

export default FormField;