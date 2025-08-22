interface FormCardProps {
  title: string;
  onSubmit: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  formClassName?: string;
  cardClassName?: string; // only additional classes
  submitDisabled?: boolean;
}

export function FormCard({
  title,
  onSubmit,
  onCancel,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  formClassName = "space-y-4",
  cardClassName = "card-secondary",
  submitDisabled,
}: FormCardProps) {
  return (
    <form onSubmit={onSubmit} className={formClassName}>
      <div className={`card ${cardClassName}`}>
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>

        <div className="card-body">{children}</div>

        <div className="card-footer">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-default"
            >
              {cancelLabel}
            </button>
          )}
          <button type="submit" className="btn btn-success float-right" disabled={submitDisabled} >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}