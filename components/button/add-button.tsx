import { Icon } from "../icons";

export function AddButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-[#383838] justify-center min-h-[44px] gap-2 flex items-center px-4 rounded-2xl `}
    >
      <Icon name="Plus" className="text-primary" />
    </button>
  );
}
