import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  player_id: {
    type: String,
    unique: true,
  },
  highest_WPM: {
    type: Number,
  },
  average_WPM: {
    type: Number,
  },
  races_amount: {
    type: Number,
  },
});

const Stats = mongoose.models.Stats || mongoose.model("Stats", statsSchema);

export default Stats;
