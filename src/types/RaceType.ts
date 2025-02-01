import { Mode } from "@/enums/Mode";

interface RaceType {
  player_id: string;
  WPM: number;
  accuracy: number;
  selectedTime: number;
  selectedMode: Mode;
  progress: number;
  _id: string;
  __v: number;
}

export default RaceType;
