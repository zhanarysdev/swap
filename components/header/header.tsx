export function Header({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <div className="mb-16">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold leading-7">{title}</div>
        <div className="text-[#AAAAAA] font-semibold text-base leading-5">
          {subTitle}
        </div>
      </div>
    </div>
  );
}
