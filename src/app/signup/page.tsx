/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/util/axiosInstance";
import EyeClosed from "../../../public/eye-closed.svg";
import EyeOpened from "../../../public/eye-opened.svg";
import Image from "next/image";

const userSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserFormData = z.infer<typeof userSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const response = await api.post("/users/signup", data);
      console.log(response);
      router.push("/");
    } catch (error: any) {
      setError("root", {
        type: "server",
        message: error.response.data.error,
      });
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="p-2 rounded-md bg-[#323437] text-[#d1d0c5] focus:outline-none w-full"
              placeholder="Enter password..."
              autoComplete="off"
            />
            <div
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <Image src={EyeOpened} alt="opened" width={25} />
              ) : (
                <Image src={EyeClosed} alt="closed" width={25} />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="p-2 rounded-md bg-[#323437] text-[#d1d0c5] focus:outline-none w-full"
              placeholder="Confirm password..."
              autoComplete="off"
            />
            <div
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <Image src={EyeOpened} alt="opened" width={25} />
              ) : (
                <Image src={EyeClosed} alt="closed" width={25} />
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
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
