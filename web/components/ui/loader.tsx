export function Loader() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="mira-spinner" />
        </div>
    );
}

export function FullPageLoader({ label = "Loading dashboard..." }: { label?: string }) {
    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4">
            <div className="mira-spinner" />
            <p className="animate-pulse text-[11px] font-medium text-slate-500">
                {label}
            </p>
        </div>
    );
}
