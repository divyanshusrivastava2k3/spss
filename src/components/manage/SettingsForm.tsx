"use client";

import { toast } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageUp, Trash2, Upload } from "lucide-react";

export const SettingsForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ logo: false, favicon: false, donationQrCodeUrl: false });
  const [formData, setFormData] = useState({
    ngoName: "",
    ngoNameHi: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#166534",
    secondaryColor: "#15803d",
    accentColor: "#16a34a",
    aboutText: "",
    aboutTextHi: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    addressHi: "",
    metaTitle: "",
    metaTitleHi: "",
    metaDescription: "",
    metaDescriptionHi: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    linkedinUrl: "",
    donationTitle: "",
    donationTitleHi: "",
    donationDescription: "",
    donationDescriptionHi: "",
    donationQrCodeUrl: "",
    upiId: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
  });

  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/settings");
        if (res.data) {
          const cleaned = Object.fromEntries(
            Object.entries(res.data).map(([key, value]) => [key, value ?? ""])
          );
          setFormData((prev) => ({ ...prev, ...cleaned }));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (file: File | null, type: "logo" | "favicon") => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post("/api/upload", form);
      setFormData((prev) => ({ ...prev, [type === "logo" ? "logoUrl" : "faviconUrl"]: res.data.url }));
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/settings", formData);
      toast.success("Settings updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-green-200 rounded-lg p-3 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white";
  const sectionCls = "space-y-6 bg-white rounded-xl p-6 border border-green-100";
  const labelCls = "block text-sm font-medium text-gray-800 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Branding */}
        <div className={sectionCls}>
          <h3 className="text-xl font-bold text-gray-900 border-b border-green-100 pb-3">🎨 Branding</h3>

          <div>
            <label className={labelCls}>NGO Name (English)</label>
            <input type="text" name="ngoName" value={formData.ngoName} onChange={handleChange} className={inputCls} placeholder="e.g. Sardar Patel Shikshan Sansthan" />
          </div>

          <div>
            <label className={labelCls}>संगठन का नाम (हिंदी)</label>
            <input type="text" name="ngoNameHi" value={formData.ngoNameHi} onChange={handleChange} className={inputCls} placeholder="e.g. सरदार पटेल शिक्षण संस्थान" />
          </div>

          {/* Logo */}
          <div>
            <label className={labelCls}>Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center overflow-hidden bg-green-50">
                {formData.logoUrl ? (<img src={formData.logoUrl} alt="" className="w-full h-full object-contain" />)
                  : (<ImageUp className="w-6 h-6 text-green-400" />)}
              </div>
              <div className="flex-1">
                <input type="file" ref={logoRef} accept="image/*" className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null, "logo")} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => logoRef.current?.click()} disabled={uploading.logo}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 text-gray-700 text-sm font-medium hover:bg-green-50 transition disabled:opacity-50">
                    <Upload className="w-4 h-4" />{uploading.logo ? "Uploading..." : "Upload Logo"}
                  </button>
                  {formData.logoUrl && (
                    <button type="button" onClick={() => setFormData((prev) => ({ ...prev, logoUrl: "" }))}
                      className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: Square PNG/SVG</p>
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div>
            <label className={labelCls}>Favicon (Browser Tab Icon)</label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg border-2 border-dashed border-green-200 flex items-center justify-center overflow-hidden bg-green-50">
                {formData.faviconUrl ? (<img src={formData.faviconUrl} alt="" className="w-full h-full object-contain" />)
                  : (<ImageUp className="w-5 h-5 text-green-400" />)}
              </div>
              <div className="flex-1">
                <input type="file" ref={faviconRef} accept="image/*" className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null, "favicon")} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => faviconRef.current?.click()} disabled={uploading.favicon}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 text-gray-700 text-sm font-medium hover:bg-green-50 transition disabled:opacity-50">
                    <Upload className="w-4 h-4" />{uploading.favicon ? "Uploading..." : "Upload Favicon"}
                  </button>
                  {formData.faviconUrl && (
                    <button type="button" onClick={() => setFormData((prev) => ({ ...prev, faviconUrl: "" }))}
                      className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: 32x32 PNG/ICO</p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange}
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                <input type="text" name="primaryColor" value={formData.primaryColor} onChange={handleChange}
                  className="flex-1 border border-green-200 rounded-lg p-2.5 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange}
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
                <input type="text" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange}
                  className="flex-1 border border-green-200 rounded-lg p-2.5 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Information & Contact */}
        <div className={sectionCls}>
          <h3 className="text-xl font-bold text-gray-900 border-b border-green-100 pb-3">📋 Information & Contact</h3>

          <div>
            <label className={labelCls}>About Text (English)</label>
            <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} rows={4}
              className={inputCls + " resize-y"} placeholder="Tell us about the NGO..." />
          </div>

          <div>
            <label className={labelCls}>परिचय (हिंदी)</label>
            <textarea name="aboutTextHi" value={formData.aboutTextHi} onChange={handleChange} rows={4}
              className={inputCls + " resize-y"} placeholder="संगठन के बारे में..." />
          </div>

          <div>
            <label className={labelCls}>Contact Email</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className={inputCls} placeholder="contact@example.com" />
          </div>

          <div>
            <label className={labelCls}>Contact Phone</label>
            <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={inputCls} placeholder="+91 1234567890" />
          </div>

          <div>
            <label className={labelCls}>Address (English)</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputCls + " resize-y"} placeholder="Full address..." />
          </div>

          <div>
            <label className={labelCls}>पता (हिंदी)</label>
            <textarea name="addressHi" value={formData.addressHi} onChange={handleChange} rows={2} className={inputCls + " resize-y"} placeholder="पूरा पता..." />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className={sectionCls}>
        <h3 className="text-xl font-bold text-gray-900 border-b border-green-100 pb-3">🔍 SEO & Meta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Meta Title (English)</label>
            <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>मेटा शीर्षक (हिंदी)</label>
            <input type="text" name="metaTitleHi" value={formData.metaTitleHi} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Meta Description (English)</label>
            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} className={inputCls + " resize-y"} />
          </div>
          <div>
            <label className={labelCls}>मेटा विवरण (हिंदी)</label>
            <textarea name="metaDescriptionHi" value={formData.metaDescriptionHi} onChange={handleChange} rows={3} className={inputCls + " resize-y"} />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className={sectionCls}>
        <h3 className="text-xl font-bold text-gray-900 border-b border-green-100 pb-3">🌐 Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Facebook</label>
            <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className={inputCls} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className={labelCls}>Twitter / X</label>
            <input type="url" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} className={inputCls} placeholder="https://x.com/..." />
          </div>
          <div>
            <label className={labelCls}>Instagram</label>
            <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className={inputCls} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className={labelCls}>YouTube</label>
            <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} className={inputCls} placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className={labelCls}>LinkedIn</label>
            <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className={inputCls} placeholder="https://linkedin.com/..." />
          </div>
        </div>
      </div>

      {/* Donation & Bank Settings */}
      <div className={sectionCls}>
        <h3 className="text-xl font-bold text-gray-900 border-b border-green-100 pb-3">💳 Donation & Bank Details</h3>
        
        <div>
          <label className={labelCls}>Donation Title (English)</label>
          <input type="text" name="donationTitle" value={formData.donationTitle || ""} onChange={handleChange} className={inputCls} placeholder="e.g. Support Our Cause" />
        </div>
        <div>
          <label className={labelCls}>दान शीर्षक (हिंदी)</label>
          <input type="text" name="donationTitleHi" value={formData.donationTitleHi || ""} onChange={handleChange} className={inputCls} placeholder="e.g. हमारे काम का समर्थन करें" />
        </div>
        
        <div>
          <label className={labelCls}>Donation Description (English)</label>
          <textarea name="donationDescription" value={formData.donationDescription || ""} onChange={handleChange} rows={3} className={inputCls + " resize-y"} placeholder="Why should people donate?" />
        </div>
        <div>
          <label className={labelCls}>दान विवरण (हिंदी)</label>
          <textarea name="donationDescriptionHi" value={formData.donationDescriptionHi || ""} onChange={handleChange} rows={3} className={inputCls + " resize-y"} placeholder="लोग दान क्यों करें?" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <label className={labelCls}>Bank Account Name</label>
            <input type="text" name="bankAccountName" value={formData.bankAccountName || ""} onChange={handleChange} className={inputCls} placeholder="Account Holder Name" />
          </div>
          <div>
            <label className={labelCls}>Bank Account Number</label>
            <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber || ""} onChange={handleChange} className={inputCls} placeholder="Account Number" />
          </div>
          <div>
            <label className={labelCls}>IFSC Code</label>
            <input type="text" name="bankIfscCode" value={formData.bankIfscCode || ""} onChange={handleChange} className={inputCls} placeholder="IFSC Code" />
          </div>
          <div>
            <label className={labelCls}>Bank Name</label>
            <input type="text" name="bankName" value={formData.bankName || ""} onChange={handleChange} className={inputCls} placeholder="e.g. State Bank of India" />
          </div>
          <div>
            <label className={labelCls}>UPI ID</label>
            <input type="text" name="upiId" value={formData.upiId || ""} onChange={handleChange} className={inputCls} placeholder="e.g. ngo@sbi" />
          </div>
        </div>

        {/* QR Code Upload */}
        <div className="pt-4">
          <label className={labelCls}>Payment QR Code Image</label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center overflow-hidden bg-green-50">
              {formData.donationQrCodeUrl ? (<img src={formData.donationQrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />)
                : (<ImageUp className="w-8 h-8 text-green-400" />)}
            </div>
            <div className="flex-1">
              <input type="file" id="qrUpload" accept="image/*" className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0] || null, "donationQrCodeUrl" as any)} />
              <div className="flex gap-2">
                <button type="button" onClick={() => document.getElementById('qrUpload')?.click()} disabled={uploading.donationQrCodeUrl as any}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 text-gray-700 text-sm font-medium hover:bg-green-50 transition disabled:opacity-50">
                  <Upload className="w-4 h-4" />{(uploading as any).donationQrCodeUrl ? "Uploading..." : "Upload QR Code"}
                </button>
                {formData.donationQrCodeUrl && (
                  <button type="button" onClick={() => setFormData((prev) => ({ ...prev, donationQrCodeUrl: "" }))}
                    className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Recommended: Square clear image of the QR Code</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-green-100">
        <Button disabled={loading} type="submit" size="lg" className="px-10"
          style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
          {loading ? "Saving..." : "💾 Save Configuration"}
        </Button>
      </div>
    </form>
  );
};
