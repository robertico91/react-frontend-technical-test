import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { validatePost, type PostDraft, type PostErrors } from "./validatePost";

type NewPostFormProps = {
  onSubmit: (draft: PostDraft) => void;
  onCancel: () => void;
};

const EMPTY: PostDraft = { title: "", body: "" };
const FIELD_ORDER: (keyof PostDraft)[] = ["title", "body"];

export function NewPostForm({ onSubmit, onCancel }: NewPostFormProps) {
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
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
      <Field
        id="post-title"
        label="Título"
        value={draft.title}
        onChange={(value) => update("title", value)}
        error={errors.title}
        autoFocusInPanel
      />
      <Field
        id="post-body"
        label="Texto"
        value={draft.body}
        onChange={(value) => update("body", value)}
        error={errors.body}
        multiline
      />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Publicar</Button>
      </div>
    </form>
  );
}
