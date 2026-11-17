import { Button } from "./Button";

type StatusMessageProps =
  | { kind: "error"; message: string; onRetry: () => void }
  | { kind: "empty"; message: string; action?: { label: string; onClick: () => void } };

/** Mensaje de error (con "Reintentar") o de estado vacío (con una salida opcional). */
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

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
      <p className="text-sm text-slate-600">{props.message}</p>
      {props.action && (
        <Button variant="secondary" onClick={props.action.onClick}>
          {props.action.label}
        </Button>
      )}
    </div>
  );
}
