import { HTMLAttributes } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ className = "", children, ...props }: TableProps) {
  return (
    <table className={`w-full text-sm ${className}`.trim()} {...props}>
      {children}
    </table>
  );
}
