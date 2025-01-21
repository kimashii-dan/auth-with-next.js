/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  async function handleSumbit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post("api/users/login", user);
      if (response.data.success === true) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="flex flex-col justify-center gap-14 p-7 w-[25%]  rounded-lg  bg-[#2c2e31]">
        <h1 className="text-4xl font-medium text-center ">Login</h1>
        {error && <p>{error}</p>}
        <form className="flex flex-col gap-7 " onSubmit={handleSumbit}>
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            value={user.email}
            className="p-2 rounded-md  bg-[#323437] text-[#d1d0c5] focus:outline-none"
            placeholder="Enter email..."
            autoComplete="off"
          />

          <input
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            className="p-2 rounded-md  bg-[#323437] text-[#d1d0c5] focus:outline-none"
            placeholder="Enter password..."
            autoComplete="off"
          />

          <button
            type="submit"
            className={`p-2 rounded-md border-none text-lg  ${
              buttonDisabled
                ? "bg-[#323437] text-[#d1d0c5]"
                : "bg-[#d1d0c5] text-black"
            }`}
            disabled={buttonDisabled}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <Link className="text-[#e2b714] underline" href="/signup">
            Sign up page
          </Link>
        </form>
      </div>
    </div>
  );
}
