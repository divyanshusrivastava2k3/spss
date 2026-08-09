"use client";

import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminAboutContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    missionTitle: "Our Mission",
    missionTitleHi: "हमारा मिशन",
    missionContent: "",
    missionContentHi: "",
    visionTitle: "Our Vision",
    visionTitleHi: "हमारा दृष्टिकोण",
    visionContent: "",
    visionContentHi: "",
    historyTitle: "Our Journey",
    historyTitleHi: "हमारी यात्रा",
    historyContent: "",
    historyContentHi: "",
    valuesTitle: "Core Values",
    valuesTitleHi: "मूल मूल्य",
    directorMessageTitle: "Message from Director",
    directorMessageTitleHi: "निदेशक का संदेश",
    teamTitle: "Our Team",
    teamTitleHi: "हमारी टीम",
    isActive: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("/api/about");
        if (res.data) {
          const cleaned = Object.fromEntries(
            Object.entries(res.data).map(([key, value]) => [key, value ?? ""])
          );
          setForm((prev) => ({ ...prev, ...cleaned }));
        }
      } catch (err) {
        console.error("Failed to load about content:", err);
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
      await axios.post("/api/about", form);
      setSaved(true);
      toast.success("About page content updated successfully!");
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">About Page Content</h2>
          <p className="text-gray-600 mt-1">Edit mission, vision, and history content for the About page.</p>
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
          {/* Mission */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">🎯 Mission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Mission Title (English)</label>
                <input type="text" name="missionTitle" value={form.missionTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>मिशन शीर्षक (हिंदी)</label>
                <input type="text" name="missionTitleHi" value={form.missionTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Mission Content (English)</label>
                <textarea name="missionContent" value={form.missionContent} onChange={handleChange} rows={4} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>मिशन सामग्री (हिंदी)</label>
                <textarea name="missionContentHi" value={form.missionContentHi} onChange={handleChange} rows={4} className={inputCls + " resize-y"} />
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">👁️ Vision</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Vision Title (English)</label>
                <input type="text" name="visionTitle" value={form.visionTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>दृष्टिकोण शीर्षक (हिंदी)</label>
                <input type="text" name="visionTitleHi" value={form.visionTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Vision Content (English)</label>
                <textarea name="visionContent" value={form.visionContent} onChange={handleChange} rows={4} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>दृष्टिकोण सामग्री (हिंदी)</label>
                <textarea name="visionContentHi" value={form.visionContentHi} onChange={handleChange} rows={4} className={inputCls + " resize-y"} />
              </div>
            </div>
          </div>

          {/* History */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">📜 History / Our Story</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>History Title (English)</label>
                <input type="text" name="historyTitle" value={form.historyTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>इतिहास शीर्षक (हिंदी)</label>
                <input type="text" name="historyTitleHi" value={form.historyTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>History Content (English)</label>
                <textarea name="historyContent" value={form.historyContent} onChange={handleChange} rows={5} className={inputCls + " resize-y"} />
              </div>
              <div>
                <label className={labelCls}>इतिहास सामग्री (हिंदी)</label>
                <textarea name="historyContentHi" value={form.historyContentHi} onChange={handleChange} rows={5} className={inputCls + " resize-y"} />
              </div>
            </div>
          </div>

          {/* Section Titles */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-gray-900 mb-5">🏷️ Section Titles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Director Message Title (English)</label>
                <input type="text" name="directorMessageTitle" value={form.directorMessageTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>निदेशक संदेश शीर्षक (हिंदी)</label>
                <input type="text" name="directorMessageTitleHi" value={form.directorMessageTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Team Title (English)</label>
                <input type="text" name="teamTitle" value={form.teamTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>टीम शीर्षक (हिंदी)</label>
                <input type="text" name="teamTitleHi" value={form.teamTitleHi} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Values Title (English)</label>
                <input type="text" name="valuesTitle" value={form.valuesTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>मूल्य शीर्षक (हिंदी)</label>
                <input type="text" name="valuesTitleHi" value={form.valuesTitleHi} onChange={handleChange} className={inputCls} />
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