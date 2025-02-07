/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import api from "@/util/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().toLowerCase().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/users/login", data);
      if (response.data.success === true) {
        console.log("client", response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.error) {
        setError("root", {
          type: "server",
          message: error.response.data.error,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="flex flex-col justify-center gap-14 p-7 w-[400px] rounded-lg bg-[#2c2e31]">
        <h1 className="text-4xl font-medium text-center">Login</h1>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            {...register("email")}
            className="p-2 rounded-md bg-[#323437] text-[#d1d0c5] focus:outline-none"
            placeholder="Enter email..."
            autoComplete="off"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <input
            type="password"
            {...register("password")}
            className="p-2 rounded-md bg-[#323437] text-[#d1d0c5] focus:outline-none"
            placeholder="Enter password..."
            autoComplete="off"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {errors.root && (
            <p className="text-red-500 text-center">{errors.root.message}</p>
          )}
          <button
            type="submit"
            className={`p-2 rounded-md border-none text-lg ${
              !isValid
                ? "bg-[#323437] text-[#d1d0c5]"
                : "bg-[#d1d0c5] text-black"
            }`}
            disabled={!isValid || loading}
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
