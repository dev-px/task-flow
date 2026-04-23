import { cn } from "@/lib/utils";

export default function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className = "",
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-white shadow-sm",
        "overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="py-4 px-4 md:px-5">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/40">
              <Icon className="h-5 w-5" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

            {description && (
              <p className="mt-1 text-sm text-muted-foreground leading-6">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 md:px-7">{children}</div>
    </div>
  );
}
