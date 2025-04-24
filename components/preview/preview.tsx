import { Icon } from "../icons";

export const Preview = ({
  img,
  close,
  end_date,
  publication_type,
  business_name,
  reward
}: {
  img: string;
  close: () => void;
  end_date: string;
  publication_type: string;
  business_name: string;
  reward: number;
}) => {
  const date = new Date(end_date);
  const monthNames = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center backdrop-blur-sm bg-[rgba(0,0,0,0.2)]">
      <div className="bg-black p-6 rounded-[32px] z-10 min-w-[656px] flex flex-col gap-8">
        <div className="flex justify-between items-center font-bold text-2xl leading-7">
          <span>Предпросмотр</span>
          <Icon name="Close" className="cursor-pointer" onClick={close} />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="relative h-[811px] w-[375px] border-2 border-lightGrey rounded-[50px]">
            <div className="flex flex-col items-center justify-center w-full relative h-[341px]">
              <img src="/status_bar.png" alt="" className="absolute top-0 left-0 w-full  z-10" />
              <img src="/frame.png" alt="" className="absolute top-[52px] left-0 w-full z-10" />
              <img
                src={img}
                className="absolute top-0 left-0 rounded-tr-[50px] h-[341px] object-cover rounded-tl-[50px]"
              />
            </div>
            <div className="bg-black rounded-[50px] absolute bottom-0 left-0 right-0 h-[516px]">
              <div className="flex flex-col items-center justify-center gap-2 pt-[28px] text-[#818181] font-[600] leading-5" >
                <span className="text-[#818181]">До {date.getDate()} {monthNames[date.getMonth()]}</span>
              </div>
              <div className="text-white text-center text-2xl leading-7 font-bold">{business_name}</div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="bg-[#212121] rounded-[10px] px-4 py-2">
                  {publication_type}
                </div>
              </div>


              <div className="bg-[#BEFF1B] rounded-[16px] w-[343px] mx-auto p-4 flex gap-2">
                <Icon name="Sa" />
                <div className="flex flex-col  text-[#212121]">
                  <div className="font-bold text-lg leading-6">Вы получите:</div>
                  <div>{reward}</div>
                </div>
              </div>

              <div className="bg-[#333333] p-4 w-[343px] mx-auto rounded-[16px] mt-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <Icon name="Info" />
                    Задание
                  </div>
                  <div className="py-[6px] px-3 rounded-[16px] border text-[11px] font-normal">
                    <div>Выполнить до {date.getDate()} {monthNames[date.getMonth()]}</div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
