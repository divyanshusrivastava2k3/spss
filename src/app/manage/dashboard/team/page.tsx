"use client";

import { toast } from "react-hot-toast";
import { useTranslation } from "@/lib/translation-context";
import { ImageUploader } from "@/components/manage/ImageUploader";
import { useCrudForm } from "@/hooks/useCrudForm";
import { CrudTable } from '@/components/manage/CrudTable';
import { CrudModal } from '@/components/manage/CrudModal';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  nameHi?: string;
  designation: string;
  designationHi?: string;
  bio?: string;
  bioHi?: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

interface TeamFormData {
  name: string;
  nameHi: string;
  designation: string;
  designationHi: string;
  bio: string;
  bioHi: string;
  photoUrl: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  order: number;
  isActive: boolean;
}

const initialFormData: TeamFormData = {
  name: "",
  nameHi: "",
  designation: "",
  designationHi: "",
  bio: "",
  bioHi: "",
  photoUrl: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  twitterUrl: "",
  facebookUrl: "",
  order: 0,
  isActive: true,
};

export default function AdminTeamPage() {
  const { t } = useTranslation();

  const {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities: members,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  } = useCrudForm<TeamMember, TeamFormData>({
    apiEndpoint: "/api/team",
    initialFormData,
  });


  const columns = [
    {
      key: "photoUrl",
      label: t("admin.common.photo"),
      render: (m: TeamMember) => m.photoUrl ? (
        <img src={m.photoUrl} alt={m.name} className="w-16 h-16 object-cover rounded-full" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Photo</span>
        </div>
      )
    },
    {
      key: "name",
      label: t("admin.common.name"),
      render: (m: TeamMember) => (
        <>
          <div className="font-medium text-gray-900">{m.name}</div>
          {m.nameHi && <div className="text-sm text-gray-500">{m.nameHi}</div>}
        </>
      )
    },
    {
      key: "designation",
      label: t("admin.common.designation"),
      render: (m: TeamMember) => (
        <>
          <div className="text-sm text-gray-700">{m.designation}</div>
          {m.designationHi && <div className="text-xs text-gray-500">{m.designationHi}</div>}
        </>
      )
    },
    {
      key: "social",
      label: t("admin.common.social"),
      render: (m: TeamMember) => (
        <div className="flex gap-2">
          {m.linkedinUrl && (
            <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm" title="LinkedIn">LinkedIn</a>
          )}
          {m.twitterUrl && (
            <a href={m.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-sm" title="Twitter">Twitter</a>
          )}
          {m.facebookUrl && (
            <a href={m.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline text-sm" title="Facebook">Facebook</a>
          )}
        </div>
      )
    },
    {
      key: "isActive",
      label: t("admin.common.status"),
      render: (m: TeamMember) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${m.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {m.isActive ? t("admin.common.active") : t("admin.common.inactive")}
        </span>
      )
    },
    {
      key: "order",
      label: t("admin.common.order"),
      render: (m: TeamMember) => <span className="text-sm text-gray-500">{m.order || 0}</span>
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.sidebar.team")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.team.subtitle")}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="w-4 h-4" /> {t("admin.common.addNew")}
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CrudTable
          data={members}
          columns={columns}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
          onTogglePublish={togglePublish}
          isDeleting={isDeleting}
        />
      </div>

      {/* Form Modal */}
      <CrudModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={`${editingId ? t("admin.common.edit") : t("admin.common.addNew")} ${t("admin.sidebar.team")}`}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.team.basicInfo")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.common.name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.team.namePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.nameHi")}</label>
              <input
                type="text"
                value={formData.nameHi}
                onChange={(e) => handleChange("nameHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.team.nameHiPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.common.designation")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.team.designationPlaceholder")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.designationHi")}</label>
              <input
                type="text"
                value={formData.designationHi}
                onChange={(e) => handleChange("designationHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.team.designationHiPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.email")}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.phone")}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.bio")}</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.bioHi")}</label>
              <textarea
                value={formData.bioHi}
                onChange={(e) => handleChange("bioHi", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.linkedin")}</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.twitter")}</label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => handleChange("twitterUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.facebook")}</label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.order")}</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{t("admin.common.isActive")}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.common.photo")}
          </h3>
          <ImageUploader
            currentUrl={formData.photoUrl || null}
            onUpload={(url) => handleChange("photoUrl", url)}
            label={t("admin.team.photo")}
          />
        </div>
      </CrudModal>
    </div>
  );
}
