/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/config/db";
import Stats from "@/models/statsModel";
import Race from "@/models/raceModel";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { wpm, accuracy, selectedTime, progress, selectedMode } = reqBody;
    const accessToken = (await cookies()).get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.TOKEN_SECRET!)
    );

    const userID = payload?.id;
    if (!userID) {
      return NextResponse.json(
        { error: "Invalid token payload: Missing user ID" },
        { status: 400 }
      );
    }

    const stats = await Stats.findOne({ player_id: userID });

    if (!stats) {
      const newStats = new Stats({
        player_id: userID,
        highest_WPM: wpm,
        average_WPM: wpm,
        races_amount: 1,
      });

      await newStats.save();
      console.log("New stats saved:", newStats);
    } else {
      stats.races_amount += 1;

      const new_average =
        (stats.average_WPM * (stats.races_amount - 1) + wpm) /
        stats.races_amount;

      stats.average_WPM = new_average.toFixed(2);

      if (stats.highest_WPM < wpm) {
        stats.highest_WPM = wpm;
      }

      await stats.save();
      console.log("Stats updated:", stats);
    }

    const newRace = new Race({
      player_id: userID,
      WPM: wpm,
      accuracy,
      selectedTime,
      progress,
      selectedMode,
    });

    await newRace.save();
    console.log("Race is saved", newRace);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
