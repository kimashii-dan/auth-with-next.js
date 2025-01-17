import Car from "../../public/images/progress-car.png";
import Image from "next/image";
interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-[5px] bg-[rgb(157,_156,_156)] w-full relative flex items-center">
      <div
        className="absolute [transition:left_0.2s_ease] overflow-hidden max-h-12"
        style={{
          left: `${progress}%`,
        }}
      >
        <Image
          className="h-auto w-[10vw] sm:w-[8vw] md:w-[6vw] lg:w-[4vw]"
          src={Car}
          alt="Car"
        />
      </div>
    </div>
  );
}
