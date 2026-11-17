import { useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/Button";
import { SidePanel } from "@/components/SidePanel";
import { useToast } from "@/components/toast/toastContext";
import { NewPostForm } from "./NewPostForm";
import { PostList } from "./PostList";
import { useCreatePost } from "./useCreatePost";
import { usePosts } from "./usePosts";
import type { PostDraft } from "./validatePost";

type PostsSectionProps = { userId: number; userName: string };

/** Título con el total, botón "Nueva publicación", lista y panel con el formulario. */
export function PostsSection({ userId, userName }: PostsSectionProps) {
  // Misma query que PostList: comparte caché, no hace otra petición.
  const { data } = usePosts(userId);
  const createPost = useCreatePost(userId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const showToast = useToast();

  function openForm() {
    createPost.reset(); // Un error de un envío anterior no debe verse al volver a abrir.
    setIsFormOpen(true);
  }

  function handleSubmit(draft: PostDraft) {
    createPost.mutate(draft, {
      onSuccess: () => {
        setIsFormOpen(false);
        // La nueva va arriba: se vuelve a la página 1 para que se vea.
        setSearchParams({});
        showToast({
          title: "Publicación creada",
          description: `Se ha añadido a las publicaciones de ${userName}.`,
        });
      },
    });
  }

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
        <Button className="ml-auto" aria-label="Nueva publicación" onClick={openForm}>
          <span aria-hidden="true">+</span>
          {/* Un solo hijo de texto: el gap del botón no separa "Nueva" de "publicación". */}
          <span>
            Nueva<span className="max-[374px]:hidden"> publicación</span>
          </span>
        </Button>
      </div>
      <PostList userId={userId} userName={userName} />
      <SidePanel
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        canClose={!createPost.isPending}
        title="Nueva publicación"
        description={`Para ${userName}`}
      >
        <NewPostForm
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createPost.isPending}
          submitError={
            createPost.isError
              ? "No se pudo publicar. Revisa la conexión e inténtalo de nuevo."
              : undefined
          }
        />
      </SidePanel>
    </section>
  );
}
