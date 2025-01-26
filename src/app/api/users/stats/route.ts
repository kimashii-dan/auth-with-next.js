/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/config/db";
import Stats from "@/models/statsModel";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { wpm } = reqBody;

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
