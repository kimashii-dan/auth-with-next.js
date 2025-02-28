import RaceType from "@/types/RaceType";

export default function Test({ race }: { race: RaceType }) {
  return (
    <div className="flex flex-col py-8 px-10 rounded-lg bg-[#2c2e31] font-roboto gap-5">
      <div className="flex justify-between items-center">
        <div className="">
          <p className="text-[#646669] text-sm">wpm:</p>
          <span className="text-3xl ">{race.WPM}</span>
        </div>
        <div className="">
          <p className="text-[#646669] text-sm">accuracy:</p>
          <span className="text-3xl">{race.accuracy.toFixed(2)}</span>
        </div>
        <div className="">
          <p className="text-[#646669] text-sm">selected time:</p>
          <span className="text-3xl">{race.selectedTime}</span>
        </div>
        <div className="">
          <p className="text-[#646669] text-sm">selected mode:</p>
          <span className="text-3xl">{race.selectedMode}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[#646669] text-sm">progress:</p>
        <div className="w-full h-2 bg-[#646669] rounded-md ">
          <div
            style={{ width: `${race.progress}%` }}
            className={` h-2 bg-[#e2b714] rounded-md`}
          ></div>
        </div>
      </div>
    </div>
  );
}
