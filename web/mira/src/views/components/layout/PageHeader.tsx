interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--mira-gray-500)]">{description}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
