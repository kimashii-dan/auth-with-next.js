/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout sucess",
      success: true,
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0,
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
