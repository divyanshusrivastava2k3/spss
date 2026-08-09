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
  MessageSquare,
  RotateCcw,
} from "lucide-react";

interface DirectorMsg {
  id: string;
  directorName: string;
  directorNameHi?: string;
  directorTitle: string;
  directorTitleHi?: string;
  message: string;
  messageHi?: string;
  photoUrl?: string;
  signatureUrl?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface DirectorFormData {
  directorName: string;
  directorNameHi: string;
  directorTitle: string;
  directorTitleHi: string;
  message: string;
  messageHi: string;
  photoUrl: string;
  signatureUrl: string;
  isActive: boolean;
}

const initialFormData: DirectorFormData = {
  directorName: "",
  directorNameHi: "",
  directorTitle: "",
  directorTitleHi: "",
  message: "",
  messageHi: "",
  photoUrl: "",
  signatureUrl: "",
  isActive: true,
};

export default function AdminDirectorPage() {
  const { t } = useTranslation();

  const {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities: messages,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  } = useCrudForm<DirectorMsg, DirectorFormData>({
    apiEndpoint: "/api/director",
    initialFormData,
  });

  const columns = [
    {
      key: "photoUrl",
      label: t("admin.common.photo") || "Photo",
      render: (m: DirectorMsg) => m.photoUrl ? (
        <img src={m.photoUrl} alt={m.directorName} className="w-16 h-16 object-cover rounded-full border border-gray-200" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <span className="text-gray-400 text-xs text-center">{m.directorName?.charAt(0) || "No Photo"}</span>
        </div>
      )
    },
    {
      key: "directorName",
      label: t("admin.common.name"),
      render: (m: DirectorMsg) => (
        <>
          <div className="font-medium text-gray-900">{m.directorName}</div>
          {m.directorNameHi && <div className="text-sm text-gray-500">{m.directorNameHi}</div>}
        </>
      )
    },
    {
      key: "directorTitle",
      label: t("admin.common.designation") || "Title",
      render: (m: DirectorMsg) => (
        <>
          <div className="text-sm text-gray-700">{m.directorTitle}</div>
          {m.directorTitleHi && <div className="text-xs text-gray-500">{m.directorTitleHi}</div>}
        </>
      )
    },
    {
      key: "isActive",
      label: t("admin.common.status"),
      render: (m: DirectorMsg) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${m.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {m.isActive ? t("admin.common.active") : t("admin.common.inactive")}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.sidebar.director")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.director.subtitle") || "Manage the Director's message shown on the About page."}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="w-4 h-4" /> {t("admin.common.add") || "Add New"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CrudTable
          data={messages}
          columns={columns}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
          onTogglePublish={togglePublish}
          isDeleting={isDeleting}
        />
      </div>

      <CrudModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={`${editingId ? t("admin.common.edit") : (t("admin.common.add") || "Add New")} ${t("admin.sidebar.director")}`}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        size="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Director Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.directorName}
                onChange={(e) => handleChange("directorName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">नाम (हिंदी)</label>
              <input
                type="text"
                value={formData.directorNameHi}
                onChange={(e) => handleChange("directorNameHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
              <input
                type="text"
                value={formData.directorTitle}
                onChange={(e) => handleChange("directorTitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">पद (हिंदी)</label>
              <input
                type="text"
                value={formData.directorTitleHi}
                onChange={(e) => handleChange("directorTitleHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (English) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">संदेश (हिंदी)</label>
            <textarea
              value={formData.messageHi}
              onChange={(e) => handleChange("messageHi", e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Photos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader
              currentUrl={formData.photoUrl || null}
              onUpload={(url) => handleChange("photoUrl", url)}
              label="Director Photo"
            />
            <ImageUploader
              currentUrl={formData.signatureUrl || null}
              onUpload={(url) => handleChange("signatureUrl", url)}
              label="Signature Image"
            />
          </div>
        </div>
      </CrudModal>
    </div>
  );
}
