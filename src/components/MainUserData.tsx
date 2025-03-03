import Image from "next/image";
import LogoutButton from "./LogoutButton";
import { getUserData } from "@/util/getUserData";
export default async function MainUserData() {
  try {
    const response = await getUserData();
    const { user_data, stats_data } = response;

    return (
      <>
        <div className="flex flex-col justify-center gap-8 p-7 rounded-lg bg-[#2c2e31] font-roboto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={user_data?.avatar || "/profile.svg"}
                alt="default"
                width={80}
                height={80}
              />
              <p className="text-3xl">{user_data?.username}</p>
            </div>

            <div>
              <p className="text-[#646669] text-sm">highest wpm:</p>
              <span className="text-4xl text-[#e2b714]">
                {stats_data?.highest_WPM}
              </span>
            </div>

            <div>
              <p className="text-[#646669] text-sm">average wpm:</p>
              <span className="text-4xl">{stats_data?.average_WPM}</span>
            </div>

            <div>
              <p className="text-[#646669] text-sm">amount of races:</p>
              <span className="text-4xl">{stats_data?.races_amount}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p>Email: {user_data?.email}</p>
            <LogoutButton />
          </div>
        </div>
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
