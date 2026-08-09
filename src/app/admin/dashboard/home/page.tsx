"use client";

import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function AdminHomeContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    heroTitle: "",
    heroTitleHi: "",
    heroSubtitle: "",
    heroSubtitleHi: "",
    heroCtaText: "",
    heroCtaTextHi: "",
    heroCtaLink: "/programs",
    heroBackgroundImage: "",
    heroImage1: "",
    heroImage2: "",
    heroImage3: "",
    ctaBackgroundImage: "",
    statsLabel1: "People Helped",
    statsLabel1Hi: "लोगों की मदद की",
    statsValue1: "5,000+",
    statsLabel2: "Trainings Conducted",
    statsLabel2Hi: "प्रशिक्षण आयोजित",
    statsValue2: "200+",
    statsLabel3: "Years of Service",
    statsLabel3Hi: "वर्षों की सेवा",
    statsValue3: "35+",
    statsLabel4: "Volunteers",
    statsLabel4Hi: "स्वयंसेवक",
    statsValue4: "150+",
    aboutSnippet: "",
    aboutSnippetHi: "",
    ctaTitle: "Join Us in Making a Difference",
    ctaTitleHi: "बदलाव लाने में हमारा साथ दें",
    ctaSubtitle: "Your support can help us empower more lives. Together, we can build a stronger, more self-reliant community.",
    ctaSubtitleHi: "आपका सहयोग हमें और अधिक जिंदगियों को सशक्त बनाने में मदद कर सकता है। साथ मिलकर, हम एक मजबूत, अधिक आत्मनिर्भर समुदाय का निर्माण कर सकते हैं।",
    ctaPrimaryText: "Contact Us",
    ctaPrimaryTextHi: "संपर्क करें",
    ctaSecondaryText: "Our Programs",
    ctaSecondaryTextHi: "हमारे कार्यक्रम",
    aboutImage: "",
    ctaCard1Title: "Support Our Work",
    ctaCard1TitleHi: "हमारे काम का समर्थन करें",
    ctaCard1Desc: "Your donation empowers lives.",
    ctaCard1DescHi: "आपका दान जीवन को सशक्त बनाता है।",
    ctaCard1Image: "",
    ctaCard2Title: "Volunteer With Us",
    ctaCard2TitleHi: "हमारे साथ स्वयंसेवा करें",
    ctaCard2Desc: "Contribute your time and skills.",
    ctaCard2DescHi: "अपना समय और कौशल दें।",
    ctaCard2Image: "",
    ctaCard3Title: "Become a Partner",
    ctaCard3TitleHi: "साझेदार बनें",
    ctaCard3Desc: "Collaborate for rural development.",
    ctaCard3DescHi: "ग्रामीण विकास के लिए सहयोग करें",
    ctaCard3Image: "",
    ctaCardLink: "/contact",
    isActive: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("/api/home");
        if (res.data) {
          // Convert null values to empty strings for form fields
          const cleaned = Object.fromEntries(
            Object.entries(res.data).map(([key, value]) => [key, value ?? ""])
          );
          setForm((prev) => ({ ...prev, ...cleaned }));
        }
      } catch (err) {
        console.error("Failed to load home content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.post("/api/home", form);
      setSaved(true);
      toast.success("Home page content updated successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full border border-green-200 rounded-lg p-3 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white";
  const sectionCls = "bg-white rounded-xl p-6 border border-green-100";
  const labelCls = "block text-sm font-medium text-gray-800 mb-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Home Page Content</h2>
          <p className="text-gray-600 mt-1">Edit hero section, stats, and CTA content for the homepage.</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
            ✓ Saved successfully
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Section */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">🚀 Hero Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Hero Title (English)</label>
                <input type="text" name="heroTitle" value={form.heroTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>हीरो शीर्षक (हिंदी)</label>
                <input type="text" name="heroTitleHi" value={form.heroTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hero Subtitle (English)</label>
                <textarea name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} rows={3} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>हीरो उपशीर्षक (हिंदी)</label>
                <textarea name="heroSubtitleHi" value={form.heroSubtitleHi} onChange={handleChange} rows={3} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>Hero CTA Text (English)</label>
                <input type="text" name="heroCtaText" value={form.heroCtaText} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>हीरो सीटीए टेक्स्ट (हिंदी)</label>
                <input type="text" name="heroCtaTextHi" value={form.heroCtaTextHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hero CTA Link</label>
                <input type="text" name="heroCtaLink" value={form.heroCtaLink} onChange={handleChange} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>About Snippet (English)</label>
                <textarea name="aboutSnippet" value={form.aboutSnippet} onChange={handleChange} rows={2} className={inputCls + " resize-y"} placeholder="Short description for About section..." />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>परिचय स्निपेट (हिंदी)</label>
                <textarea name="aboutSnippetHi" value={form.aboutSnippetHi} onChange={handleChange} rows={2} className={inputCls + " resize-y"} placeholder="परिचय अनुभाग के लिए संक्षिप्त विवरण..." />
              </div>
            </div>

            {/* Hero Images */}
            <div className="mt-6 pt-6 border-t border-green-100">
              <h4 className="text-md font-bold text-gray-900 mb-1">🖼️ Hero Slider Images</h4>
              <p className="text-sm text-gray-500 mb-4">Upload up to 3 images. They rotate as a slider on the homepage hero. Leave blank to use a gradient background.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImageUploader currentUrl={form.heroImage1} onUpload={(url) => setForm((prev) => ({ ...prev, heroImage1: url }))} label="Hero Image 1" />
                <ImageUploader currentUrl={form.heroImage2} onUpload={(url) => setForm((prev) => ({ ...prev, heroImage2: url }))} label="Hero Image 2" />
                <ImageUploader currentUrl={form.heroImage3} onUpload={(url) => setForm((prev) => ({ ...prev, heroImage3: url }))} label="Hero Image 3" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">📊 Stats Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="space-y-3">
                  <div>
                    <label className={labelCls}>Stat {n} Label (English)</label>
                    <input type="text" name={`statsLabel${n}`} value={(form as any)[`statsLabel${n}`]} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Stat {n} Label (हिंदी)</label>
                    <input type="text" name={`statsLabel${n}Hi`} value={(form as any)[`statsLabel${n}Hi`]} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Stat {n} Value</label>
                    <input type="text" name={`statsValue${n}`} value={(form as any)[`statsValue${n}`]} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">🎯 CTA Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>CTA Title (English)</label>
                <input type="text" name="ctaTitle" value={form.ctaTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>सीटीए शीर्षक (हिंदी)</label>
                <input type="text" name="ctaTitleHi" value={form.ctaTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CTA Subtitle (English)</label>
                <textarea name="ctaSubtitle" value={form.ctaSubtitle} onChange={handleChange} rows={3} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>सीटीए उपशीर्षक (हिंदी)</label>
                <textarea name="ctaSubtitleHi" value={form.ctaSubtitleHi} onChange={handleChange} rows={3} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>Primary Button Text (English)</label>
                <input type="text" name="ctaPrimaryText" value={form.ctaPrimaryText} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>प्राथमिक बटन टेक्स्ट (हिंदी)</label>
                <input type="text" name="ctaPrimaryTextHi" value={form.ctaPrimaryTextHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Secondary Button Text (English)</label>
                <input type="text" name="ctaSecondaryText" value={form.ctaSecondaryText} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>द्वितीयक बटन टेक्स्ट (हिंदी)</label>
                <input type="text" name="ctaSecondaryTextHi" value={form.ctaSecondaryTextHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>About Section Image</label>
                <ImageUploader currentUrl={form.aboutImage || ""} onUpload={(url) => setForm((prev) => ({ ...prev, aboutImage: url }))} label="About Image" />
              </div>
              <div>
                <label className={labelCls}>CTA Background Image</label>
                <ImageUploader currentUrl={form.ctaBackgroundImage || ""} onUpload={(url) => setForm((prev) => ({ ...prev, ctaBackgroundImage: url }))} label="CTA BG Image" />
              </div>
            </div>
          </div>

          {/* CTA Cards - Join the Movement */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">🤝 Join the Movement (3 Cards)</h3>
            <div className="space-y-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-xl bg-green-50/50 border border-green-100">
                  <div>
                    <label className={labelCls}>Card {n} Title (English)</label>
                    <input type="text" name={`ctaCard${n}Title`} value={(form as any)[`ctaCard${n}Title`]} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Card {n} Title (हिंदी)</label>
                    <input type="text" name={`ctaCard${n}TitleHi`} value={(form as any)[`ctaCard${n}TitleHi`]} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Card {n} Description (English)</label>
                    <textarea name={`ctaCard${n}Desc`} value={(form as any)[`ctaCard${n}Desc`]} onChange={handleChange} rows={2} className={inputCls + " resize-y"} />
                  </div>
                  <div>
                    <label className={labelCls}>Card {n} Description (हिंदी)</label>
                    <textarea name={`ctaCard${n}DescHi`} value={(form as any)[`ctaCard${n}DescHi`]} onChange={handleChange} rows={2} className={inputCls + " resize-y"} />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader
                      currentUrl={(form as any)[`ctaCard${n}Image`] || ""}
                      onUpload={(url) => setForm((prev) => ({ ...prev, [`ctaCard${n}Image`]: url }))}
                      label={`Card ${n} Image`}
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className={labelCls}>CTA Card Link (all cards)</label>
                <input type="text" name="ctaCardLink" value={form.ctaCardLink} onChange={handleChange} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 text-white rounded-xl text-sm font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}