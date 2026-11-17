import { useState } from "react";
import { Button } from "@/components/Button";
import { SidePanel } from "@/components/SidePanel";
import { NewPostForm } from "./NewPostForm";
import { PostList } from "./PostList";
import { usePosts } from "./usePosts";

type PostsSectionProps = { userId: number; userName: string };

/** Título con el total, botón "Nueva publicación", lista y panel con el formulario. */
export function PostsSection({ userId, userName }: PostsSectionProps) {
  // Misma query que PostList: comparte caché, no hace otra petición.
  const { data } = usePosts(userId);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section aria-labelledby="posts-title" className="flex flex-col md:min-h-0 md:flex-1">
      <div className="flex items-center gap-2 px-4 pt-4 md:px-6">
        <h3 id="posts-title" className="text-base font-semibold text-slate-900">
          Publicaciones
        </h3>
        {/* El total va junto al título: el final de la línea es para "Nueva publicación". */}
        <span aria-live="polite" className="text-sm text-slate-600">
          {data && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
              {data.length}
              <span className="sr-only"> publicaciones</span>
            </span>
          )}
        </span>
        {/* Por debajo de 375 px solo se ve "Nueva"; aria-label mantiene el nombre completo. */}
        <Button
          className="ml-auto"
          aria-label="Nueva publicación"
          onClick={() => setIsFormOpen(true)}
        >
          <span aria-hidden="true">+</span> Nueva
          <span className="max-[374px]:hidden"> publicación</span>
        </Button>
      </div>
      <PostList userId={userId} userName={userName} />
      <SidePanel
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={`Nueva publicación de ${userName}`}
      >
        <NewPostForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </SidePanel>
    </section>
  );
}
