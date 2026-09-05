export const BuilderButtonField = ({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    className="self-start rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground"
    onClick={onClick}
  >
    {label}
  </button>
)
