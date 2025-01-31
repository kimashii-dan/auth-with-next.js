/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/config/db";
import Stats from "@/models/statsModel";
import Race from "@/models/raceModel";

connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN_SECRET)
    );

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json({ existence: false });
    }

    const stats = await Stats.findOne({ player_id: payload.id });

    const races = await Race.find({ player_id: payload.id })
      .sort({ _id: -1 })
      .limit(8);

    return NextResponse.json({
      success: true,
      user_data: user,
      stats_data: stats,
      races_data: races,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid token or server error" },
      { status: 500 }
    );
  }
}
