import Car from "../../public/images/progress-car.png";
import Image from "next/image";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-[5px] bg-[rgb(157,_156,_156)] w-full relative flex items-center ">
      <div
        className="absolute [transition:left_0.2s_ease] overflow-hidden"
        style={{
          left: `calc(${progress}% - ${(progress / 100) * 80}px)`,
        }}
      >
        <Image className="h-auto w-20 max-w-none" src={Car} alt="Car" />
      </div>
    </div>
  );
}
