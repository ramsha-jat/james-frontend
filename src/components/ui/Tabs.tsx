import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/utils/cn";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List className={cn("flex gap-2", className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      "flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm data-[state=active]:bg-black data-[state=active]:text-white",
      className
    )}
    {...props}
  />
);
export const TabsContent = TabsPrimitive.Content;
