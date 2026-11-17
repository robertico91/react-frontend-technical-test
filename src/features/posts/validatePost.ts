export type PostDraft = { title: string; body: string };
export type PostErrors = Partial<Record<keyof PostDraft, string>>;

/** Título y texto obligatorios; un valor hecho solo de espacios no cuenta. */
export function validatePost({ title, body }: PostDraft): PostErrors {
  const errors: PostErrors = {};
  if (!title.trim()) errors.title = "El título es obligatorio";
  if (!body.trim()) errors.body = "El texto es obligatorio";
  return errors;
}
