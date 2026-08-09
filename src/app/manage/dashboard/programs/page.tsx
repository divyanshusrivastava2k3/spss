"use client";
import { CrudTable } from '@/components/manage/CrudTable';
import { CrudModal } from '@/components/manage/CrudModal';

import { toast } from "react-hot-toast";
import { useTranslation } from "@/lib/translation-context";
import { ImageUploader } from "@/components/manage/ImageUploader";
import { useCrudForm } from "@/hooks/useCrudForm";
import { formatDateForInput } from "@/lib/date-utils";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

interface Program {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  imageUrl?: string;
  category?: string;
  categoryHi?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
}

interface ProgramFormData {
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  imageUrl: string;
  category: string;
  categoryHi: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
}

const CATEGORIES = [
  { value: "skill-development", labelEn: "Skill Development", labelHi: "कौशल विकास" },
  { value: "livelihood", labelEn: "Livelihood", labelHi: "आजीविका" },
  { value: "education", labelEn: "Education", labelHi: "शिक्षा" },
  { value: "women-empowerment", labelEn: "Women Empowerment", labelHi: "महिला सशक्तिकरण" },
  { value: "community", labelEn: "Community", labelHi: "सामुदायिक" },
];

const initialFormData: ProgramFormData = {
  title: "",
  titleHi: "",
  description: "",
  descriptionHi: "",
  imageUrl: "",
  category: "skill-development",
  categoryHi: "",
  startDate: "",
  endDate: "",
  isActive: true,
  order: 0,
};

export default function AdminProgramsPage() {
  const { t } = useTranslation();

  const {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities: programs,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  } = useCrudForm<Program, ProgramFormData>({
    apiEndpoint: "/api/programs",
    initialFormData,
    generateSlug: (title) => title.toLowerCase().replace(/\s+/g, "-"),
    onSuccess: () => {
      toast.success(editingId ? "Program updated!" : "Program created!");
    },
    transformPayload: (data) => ({
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    }),
  });

  // Handle category change to auto-fill Hindi label
  const handleCategoryChange = (value: string) => {
    const category = CATEGORIES.find((c) => c.value === value);
    handleChange("category", value);
    handleChange("categoryHi", category?.labelHi || "");
  };

  // Removed custom handleSubmitWrapper. Using hook's handleSubmit instead.

  const columns = [
    {
      key: "imageUrl",
      label: t("admin.common.image"),
      render: (p: Program) => p.imageUrl ? (
        <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded-lg" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )
    },
    {
      key: "title",
      label: t("admin.common.title"),
      render: (p: Program) => (
        <>
          <div className="font-medium text-gray-900">{p.title}</div>
          {p.titleHi && <div className="text-sm text-gray-500">{p.titleHi}</div>}
        </>
      )
    },
    {
      key: "category",
      label: t("admin.common.category"),
      render: (p: Program) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          {p.categoryHi || p.category || "-"}
        </span>
      )
    },
    {
      key: "dates",
      label: t("admin.common.dates"),
      render: (p: Program) => (
        <div className="text-sm text-gray-500">
          {p.startDate && <div>{t("admin.common.start")}: {formatDateForInput(p.startDate)}</div>}
          {p.endDate && <div>{t("admin.common.end")}: {formatDateForInput(p.endDate)}</div>}
        </div>
      )
    },
    {
      key: "isActive",
      label: t("admin.common.status"),
      render: (p: Program) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {p.isActive ? t("admin.common.active") : t("admin.common.inactive")}
        </span>
      )
    },
    {
      key: "order",
      label: t("admin.common.order"),
      render: (p: Program) => <span className="text-sm text-gray-500">{p.order || 0}</span>
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.programs.title")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.programs.subtitle")}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="w-4 h-4" /> {t("admin.common.addNew")}
        </button>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CrudTable
          data={programs}
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
        title={`${editingId ? t("admin.common.edit") : t("admin.common.addNew")} ${t("admin.programs.title")}`}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.programs.basicInfo")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.common.title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.programs.titlePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.titleHi")}</label>
              <input
                type="text"
                value={formData.titleHi}
                onChange={(e) => handleChange("titleHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.programs.titleHiPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.common.description")} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
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
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.common.image")}
          </h3>
          <ImageUploader
            currentUrl={formData.imageUrl || null}
            onUpload={(url) => handleChange("imageUrl", url)}
            label={t("admin.programs.coverImage")}
          />
        </div>

        {/* Category & Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.programs.categoryAndDates")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.categoryHi")}</label>
              <input
                type="text"
                value={formData.categoryHi}
                onChange={(e) => handleChange("categoryHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.startDate")}</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.endDate")}</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
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
      </CrudModal>
    </div>
  );
}
