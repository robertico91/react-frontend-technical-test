import { Button } from "./Button";

type StatusMessageProps =
  { kind: "error"; message: string; onRetry: () => void } | { kind: "empty"; message: string };

/** Mensaje de error (con "Reintentar") o de estado vacío dentro de una lista. */
export function StatusMessage(props: StatusMessageProps) {
  if (props.kind === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 px-4 py-8 text-center">
        <p className="text-sm text-red-700">{props.message}</p>
        <Button variant="secondary" onClick={props.onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  return <p className="px-4 py-8 text-center text-sm text-slate-600">{props.message}</p>;
}
