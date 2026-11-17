type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Textarea en lugar de input. */
  multiline?: boolean;
  readOnly?: boolean;
  /** Recibe el foco al abrir el panel que lo contiene. */
  autoFocusInPanel?: boolean;
};

const CONTROL =
  "w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-brand focus:ring-4 focus:ring-brand/20 focus:outline-none aria-invalid:border-red-600 aria-invalid:focus:ring-red-600/20 read-only:bg-slate-50";

/** Campo con label visible y error asociado (aria-invalid + aria-describedby). */
export function Field({
  id,
  label,
  value,
  onChange,
  error,
  multiline = false,
  readOnly = false,
  autoFocusInPanel = false,
}: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    value,
    readOnly,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "data-autofocus": autoFocusInPanel ? "" : undefined,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-900">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={8}
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL} resize-y py-2`}
        />
      ) : (
        <input
          {...shared}
          type="text"
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL} h-10`}
        />
      )}
      {/* Sin role="alert": al enviar se anunciarían todos a la vez. El foco va al primer campo
          inválido y el lector lee su error a través de aria-describedby. */}
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
