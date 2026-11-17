import { Link } from "react-router";
import { usePageTitle } from "@/hooks/usePageTitle";
import { EmptyState } from "./EmptyState";

type NotFoundProps = { title: string; description: string };

export function NotFound({ title, description }: NotFoundProps) {
  usePageTitle(title);
  return (
    <EmptyState title={title} description={description} isScreenTitle>
      <Link
        to="/"
        className="rounded text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      >
        Ver la lista de usuarios
      </Link>
    </EmptyState>
  );
}
