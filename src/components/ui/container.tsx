import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: "default" | "prose" | "wide";
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const sizeMap: Record<NonNullable<ContainerProps<"div">["size"]>, string> = {
  default: "max-w-7xl",
  prose: "max-w-[720px]",
  wide: "max-w-[1440px]",
};

/**
 * App-wide content container. Handles horizontal padding and max-width for
 * all three content widths used by the editorial layout.
 */
export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "mx-auto w-full px-6 md:px-10",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
