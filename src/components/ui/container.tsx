import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 3xl:max-w-[1600px]", className)}>
      {children}
    </Tag>
  );
}

/** 12-column grid on desktop, 8 on tablet, 4 on mobile. */
export function Grid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid grid-cols-4 gap-x-4 md:grid-cols-8 md:gap-x-6 lg:grid-cols-12", className)}>
      {children}
    </div>
  );
}
