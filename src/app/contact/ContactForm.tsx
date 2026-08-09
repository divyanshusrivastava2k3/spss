"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("idle");
      // Could add a toast error here if needed
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-green-200 text-gray-900 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 bg-white transition-all";

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("contact.form.title")}</h3>
      {status === "sent" ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h4 className="text-xl font-bold text-gray-900 mb-2">{t("contact.form.success")}</h4>
          <p className="text-gray-600">{t("contact.form.thankYou")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">{t("contact.form.name")}</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("contact.form.name")} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">{t("contact.form.email")}</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("contact.form.email")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">{t("contact.form.phone")}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t("contact.form.phone")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">{t("contact.form.subject")}</label>
            <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t("contact.form.subject")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">{t("contact.form.message")}</label>
            <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("contact.form.message")} className={inputCls + " resize-none"} />
          </div>
          <button type="submit" disabled={status === "sending"} className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
            {status === "sending" ? (
              <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t("contact.form.sending")}</>
            ) : (<><Send className="w-5 h-5" /> {t("contact.form.submit")}</>)}
          </button>
        </form>
      )}
    </div>
  );
}