"use client";

import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import axios from "axios";
import { Upload, Trash2, FileText } from "lucide-react";

interface PdfUploaderProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  label?: string;
}

export const PdfUploader = ({ currentUrl, onUpload, label = "PDF File" }: PdfUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const url = currentUrl || "";

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      // 1. Get signed URL and token from our server
      const res = await axios.post("/api/upload/signed-url", {
        filename: file.name,
        contentType: file.type,
      });

      const { token, path, publicUrl, supabaseUrl } = res.data;

      // 2. Upload directly to Supabase Storage bypassing Vercel limits
      const { createClient } = await import("@supabase/supabase-js");
      // Use a dummy key since we authenticate using the token
      const supabase = createClient(supabaseUrl, "dummy-key-not-used");
      
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(publicUrl);
      toast.success("PDF uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      const msg = error.response?.data?.error || error.message || "PDF upload failed. Try again.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0 text-center px-2">
          {url ? (
            <>
              <FileText className="w-8 h-8 text-red-500 mb-1" />
              <span className="text-[10px] text-gray-500 truncate w-full" title={url}>PDF Uploaded</span>
            </>
          ) : (
            <FileText className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="file"
            ref={inputRef}
            accept="application/pdf"
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
              {uploading ? "Uploading..." : "Upload PDF"}
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
          <p className="text-xs text-gray-500 mt-1">Upload new PDF or enter URL below</p>
          <input
            type="text"
            value={url}
            onChange={(e) => onUpload(e.target.value)}
            placeholder="Or paste PDF URL..."
            className="mt-2 w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
