import { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = ({ className, children, ...props }: SelectProps) => {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
