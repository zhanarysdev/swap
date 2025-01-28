import { Arrow } from "./arrow";
import { Logo } from "./logo";

const icons = {
  Arrow,
  Logo,
};
export function Icon({
  className,
  name,
}: {
  className?: string;
  name: keyof typeof icons;
}) {
  const Component = icons[name];
  return (
    <div className={className}>
      <Component />
    </div>
  );
}
