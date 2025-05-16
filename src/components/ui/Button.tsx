import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button = ({ className, variant = "default", ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        variant === "default" && "bg-black text-white hover:bg-gray-800",
        variant === "outline" && "border border-gray-300 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
};
