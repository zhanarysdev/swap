import { Icon } from "../icons";

export const Preview = ({
  img,
  close,
  end_date,
}: {
  img: string;
  close: () => void;
  end_date: string;
}) => {
  const date = new Date(end_date);
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center backdrop-blur-sm bg-[rgba(0,0,0,0.2)]">
      <div className="bg-black p-6 rounded-[32px] z-10 min-w-[656px] flex flex-col gap-8">
        <div className="flex justify-between items-center font-bold text-2xl leading-7">
          <span>Предпросмотр</span>
          <Icon name="Close" className="cursor-pointer" onClick={close} />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="relative h-[811px] w-[375px] border-2 border-lightGrey rounded-[50px]">
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={img}
                className="rounded-tr-[50px] h-[341px] object-cover rounded-tl-[50px]"
              />
            </div>
            <div className="bg-black rounded-tl-[50px] rounded-tr-[50px] absolute bottom-0 left-0 right-0 h-[516px]">
              <div>
                До {date.getDay()} {date.getMonth()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
