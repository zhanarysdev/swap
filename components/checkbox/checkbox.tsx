export function Checkbox({ styles, checked = false, onChange }: { styles?: string; checked?: boolean; onChange?: () => void }) {
  return (
    <label className={`container ${styles}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
    </label>
  );
}
