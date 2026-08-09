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
  ExternalLink,
  RotateCcw,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  nameHi?: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  descriptionHi?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

interface PartnerFormData {
  name: string;
  nameHi: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  descriptionHi: string;
  category: string;
  order: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "government", labelEn: "Government", labelHi: "सरकार" },
  { value: "corporate", labelEn: "Corporate", labelHi: "कॉर्पोरेट" },
  { value: "ngo", labelEn: "NGO", labelHi: "एनजीओ" },
  { value: "academic", labelEn: "Academic", labelHi: "शैक्षणिक" },
  { value: "general", labelEn: "General", labelHi: "सामान्य" },
];

const initialFormData: PartnerFormData = {
  name: "",
  nameHi: "",
  logoUrl: "",
  websiteUrl: "",
  description: "",
  descriptionHi: "",
  category: "government",
  order: 0,
  isActive: true,
};

export default function AdminPartnersPage() {
  const { t } = useTranslation();

  const {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities: partners,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  } = useCrudForm<Partner, PartnerFormData>({
    apiEndpoint: "/api/partners",
    initialFormData,
  });

  const handleCategoryChange = (value: string) => {
    const category = CATEGORIES.find((c) => c.value === value);
    handleChange("category", value);
  };


  const columns = [
    {
      key: "logoUrl",
      label: t("admin.common.logo"),
      render: (p: Partner) => p.logoUrl ? (
        <img src={p.logoUrl} alt={p.name} className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Logo</span>
        </div>
      )
    },
    {
      key: "name",
      label: t("admin.common.name"),
      render: (p: Partner) => (
        <>
          <div className="font-medium text-gray-900">{p.name}</div>
          {p.nameHi && <div className="text-sm text-gray-500">{p.nameHi}</div>}
        </>
      )
    },
    {
      key: "category",
      label: t("admin.common.category"),
      render: (p: Partner) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {CATEGORIES.find((c) => c.value === p.category)?.labelHi || p.category || "-"}
        </span>
      )
    },
    {
      key: "website",
      label: t("admin.common.website"),
      render: (p: Partner) => p.websiteUrl ? (
        <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-green-600 hover:underline">
          <ExternalLink className="w-3 h-3" /> Visit
        </a>
      ) : (
        <span className="text-gray-400 text-sm">-</span>
      )
    },
    {
      key: "isActive",
      label: t("admin.common.status"),
      render: (p: Partner) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {p.isActive ? t("admin.common.active") : t("admin.common.inactive")}
        </span>
      )
    },
    {
      key: "order",
      label: t("admin.common.order"),
      render: (p: Partner) => <span className="text-sm text-gray-500">{p.order || 0}</span>
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.sidebar.partners")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.partners.subtitle")}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="w-4 h-4" /> {t("admin.common.addNew")}
        </button>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CrudTable
          data={partners}
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
        title={`${editingId ? t("admin.common.edit") : t("admin.common.addNew")} ${t("admin.sidebar.partners")}`}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.partners.basicInfo")}
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
                placeholder={t("admin.partners.namePlaceholder")}
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
                placeholder={t("admin.partners.nameHiPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.website")}</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.category")}</label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.description")}</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.descriptionHi")}</label>
              <textarea
                value={formData.descriptionHi}
                onChange={(e) => handleChange("descriptionHi", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        {/* Logo Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.common.logo")}
          </h3>
          <ImageUploader
            currentUrl={formData.logoUrl || null}
            onUpload={(url) => handleChange("logoUrl", url)}
            label={t("admin.partners.logo")}
          />
        </div>
      </CrudModal>
    </div>
  );
}
