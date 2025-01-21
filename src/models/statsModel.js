import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  player_id: {
    type: String,
    required: [true, "Player ID is required"],
    unique: true,
  },
  highest_WPM: {
    type: Number,
    default: 0,
  },
  average_WPM: {
    type: Number,
    default: 0,
  },
  races_amount: {
    type: Number,
    default: 0,
  },
});

const Stats = mongoose.models.Stats || mongoose.model("Stats", statsSchema);

export default Stats;
