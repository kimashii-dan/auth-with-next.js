/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function SignUpPage() {
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
      const response = await axios.post("api/users/signup", data);
      if (response.data.success) {
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
      <div className="flex flex-col justify-center gap-10 p-7 w-[400px] rounded-lg bg-[#2c2e31]">
        <h1 className="text-4xl font-medium text-center">Register</h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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

          <input
            type="text"
            {...register("username")}
            className="p-2 rounded-md bg-[#323437] text-[#d1d0c5] focus:outline-none"
            placeholder="Enter username..."
            autoComplete="off"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
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
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <Link className="text-[#e2b714] underline text-center" href="/login">
            Login page
          </Link>
        </form>
      </div>
    </div>
  );
}
