"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Lock, User, Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function ChangeCredentialsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.newUsername,
          password: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update credentials");
      }

      toast.success("Credentials updated successfully! Please login again.");
      reset();
      
      // Log out user so they have to login with new credentials
      setTimeout(() => {
        signOut({ callbackUrl: "/manage/login" });
      }, 1500);
      
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 mt-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <Lock className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
          <p className="text-sm text-gray-500">Update your admin username and password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">New Username</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("newUsername", { 
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters required" }
              })}
              type="text"
              placeholder="e.g. admin_new"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          {errors.newUsername && (
            <p className="text-red-500 text-xs mt-1">{errors.newUsername.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("newPassword", { 
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters required" }
              })}
              type="password"
              placeholder="••••••••"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              {...register("confirmPassword", { required: "Please confirm your password" })}
              type="password"
              placeholder="••••••••"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Credentials"}
        </button>
      </form>
    </div>
  );
}
