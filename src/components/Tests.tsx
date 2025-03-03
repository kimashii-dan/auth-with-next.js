import RaceType from "@/types/RaceType";
import { getUserData } from "@/util/getUserData";
export default async function Tests() {
  try {
    const response = await getUserData();
    const { races_data } = response;

    return (
      <>
        {races_data?.map((race: RaceType, index: number) => (
          <div
            key={index}
            className="flex flex-col py-8 px-10 rounded-lg bg-[#2c2e31] font-roboto gap-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#646669] text-sm">wpm:</p>
                <span className="text-3xl">{race.WPM}</span>
              </div>
              <div>
                <p className="text-[#646669] text-sm">accuracy:</p>
                <span className="text-3xl">{race.accuracy.toFixed(2)}</span>
              </div>
              <div>
                <p className="text-[#646669] text-sm">selected time:</p>
                <span className="text-3xl">{race.selectedTime}</span>
              </div>
              <div>
                <p className="text-[#646669] text-sm">selected mode:</p>
                <span className="text-3xl">{race.selectedMode}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[#646669] text-sm">progress:</p>
              <div className="w-full h-2 bg-[#646669] rounded-md">
                <div
                  style={{ width: `${race.progress}%` }}
                  className="h-2 bg-[#e2b714] rounded-md"
                ></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return (
      <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto">
        <p className="text-red-500">
          Failed to load user data. Please try again. Error: {errorMessage}
        </p>
      </div>
    );
  }
}
