"use client";

import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import axios from "axios";
import { Upload, Trash2, ImageUp } from "lucide-react";

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  label?: string;
}

export const ImageUploader = ({ currentUrl, onUpload, label = "Image" }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const url = currentUrl || "";

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post("/api/upload", form);
      onUpload(res.data.url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      const msg = error.response?.data?.error || "Image upload failed. Try again.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
          {url ? (
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageUp className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => onUpload("")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload new image or enter URL below</p>
          <input
            type="text"
            value={url}
            onChange={(e) => onUpload(e.target.value)}
            placeholder="Or paste image URL..."
            className="mt-2 w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
