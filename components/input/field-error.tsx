export function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <span className="text-[#D93438] text-sm">{error}</span>;
}
