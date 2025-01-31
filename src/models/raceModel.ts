import mongoose from "mongoose";

const raceSchema = new mongoose.Schema({
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Player ID is required"],
    unique: true,
    ref: "User",
  },
  WPM: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  selectedTime: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const Race = mongoose.models.Race || mongoose.model("Race", raceSchema);

export default Race;
