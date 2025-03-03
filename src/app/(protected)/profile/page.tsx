import "../../globals.css";
import Tests from "@/components/Tests";
import MainUserData from "@/components/MainUserData";

export default function UserProfile() {
  console.log("profile server");
  return (
    <div className="relative flex flex-col gap-10">
      <MainUserData />
      <h1 className="text-4xl mt-7 font-roboto">Recent Tests</h1>
      <Tests />
    </div>
  );
}
