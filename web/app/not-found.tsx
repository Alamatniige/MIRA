import { NotFound } from "@/components/layout/NotFound";

export const metadata = {
    title: "404 – Page Not Found | MIRA",
    description: "The page you are looking for doesn't exist or may have been moved.",
};

export default function NotFoundPage() {
    return <NotFound />;
}
