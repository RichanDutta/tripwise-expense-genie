
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  width?: "full" | "wide" | "medium" | "narrow";
}

export function Container({
  className,
  children,
  as: Component = "div",
  width = "medium",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto px-4 sm:px-6 md:px-8",
        {
          "max-w-full": width === "full",
          "max-w-screen-2xl": width === "wide",
          "max-w-screen-xl": width === "medium",
          "max-w-screen-lg": width === "narrow",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
