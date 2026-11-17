import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { validatePost, type PostDraft, type PostErrors } from "./validatePost";

type NewPostFormProps = {
  onSubmit: (draft: PostDraft) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  /** Error del envío; lo escrito se conserva para poder reintentar. */
  submitError?: string;
};

const EMPTY: PostDraft = { title: "", body: "" };
const FIELD_ORDER: (keyof PostDraft)[] = ["title", "body"];

export function NewPostForm({ onSubmit, onCancel, isSubmitting, submitError }: NewPostFormProps) {
  const [draft, setDraft] = useState<PostDraft>(EMPTY);
  const [errors, setErrors] = useState<PostErrors>({});
  // Se valida al enviar; a partir de ahí, también al escribir, para que el error desaparezca
  // en cuanto se corrige (y no aparezca antes de que el usuario haya intentado enviar).
  const [attempted, setAttempted] = useState(false);

  function update(field: keyof PostDraft, value: string) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (attempted) setErrors(validatePost(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Los botones usan aria-disabled (no disabled, que les quita el foco): la protección
    // contra un doble envío está aquí.
    if (isSubmitting) return;

    const nextErrors = validatePost(draft);
    setErrors(nextErrors);
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`post-${firstInvalid}`)?.focus();
      return;
    }
    onSubmit({ title: draft.title.trim(), body: draft.body.trim() });
  }

  return (
    // Los campos se desplazan si hace falta; los botones quedan siempre al final del panel.
    <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
        <Field
          id="post-title"
          label="Título"
          value={draft.title}
          onChange={(value) => update("title", value)}
          error={errors.title}
          readOnly={isSubmitting}
          autoFocusInPanel
        />
        <Field
          id="post-body"
          label="Texto"
          value={draft.body}
          onChange={(value) => update("body", value)}
          error={errors.body}
          readOnly={isSubmitting}
          multiline
        />
        {submitError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
        <Button
          variant="secondary"
          aria-disabled={isSubmitting || undefined}
          onClick={() => {
            if (!isSubmitting) onCancel();
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" aria-disabled={isSubmitting || undefined}>
          {isSubmitting && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="size-4 motion-safe:animate-spin"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="3"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          )}
          {isSubmitting ? "Publicando…" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
