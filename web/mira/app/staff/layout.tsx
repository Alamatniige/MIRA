import { StaffLayout } from "@/layouts/StaffLayout";

export default function StaffLayoutRoute({
  children,
}: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}
