import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {children}
      <Toaster position="top-right" />
    </div>
  );
}
