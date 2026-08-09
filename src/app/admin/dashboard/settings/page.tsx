import { SettingsForm } from "@/components/admin/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Global Settings</h2>
        <p className="text-gray-600 mt-2 text-base">
          Manage your NGO website&apos;s appearance, branding, and contact details from here.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}