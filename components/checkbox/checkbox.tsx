export function Checkbox({ styles }: { styles?: string }) {
  return (
    <label className={`container ${styles}`}>
      <input type="checkbox" />
      <span className="checkmark"></span>
    </label>
  );
}
