"use client";

import { toast } from "react-hot-toast";
import { useTranslation } from "@/lib/translation-context";
import { ImageUploader } from "@/components/manage/ImageUploader";
import { useCrudForm } from "@/hooks/useCrudForm";
import { CrudTable } from '@/components/manage/CrudTable';
import { CrudModal } from '@/components/manage/CrudModal';
import {
  Plus,
  Trash2,
  X,
  Pencil,
  RotateCcw,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  titleHi?: string;
  imageUrl: string;
  category?: string;
  categoryHi?: string;
  description?: string;
  descriptionHi?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

interface GalleryFormData {
  title: string;
  titleHi: string;
  imageUrl: string;
  category: string;
  categoryHi: string;
  description: string;
  descriptionHi: string;
  order: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "training", labelEn: "Training", labelHi: "प्रशिक्षण" },
  { value: "events", labelEn: "Events", labelHi: "कार्यक्रम" },
  { value: "community", labelEn: "Community", labelHi: "समुदाय" },
  { value: "partners", labelEn: "Partners", labelHi: "साझेदार" },
  { value: "general", labelEn: "General", labelHi: "सामान्य" },
];

const initialFormData: GalleryFormData = {
  title: "",
  titleHi: "",
  imageUrl: "",
  category: "training",
  categoryHi: "",
  description: "",
  descriptionHi: "",
  order: 0,
  isActive: true,
};

export default function AdminGalleryPage() {
  const { t } = useTranslation();

  const {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities: items,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  } = useCrudForm<GalleryItem, GalleryFormData>({
    apiEndpoint: "/api/gallery",
    initialFormData,
  });

  const handleCategoryChange = (value: string) => {
    const category = CATEGORIES.find((c) => c.value === value);
    handleChange("category", value);
    handleChange("categoryHi", category?.labelHi || "");
  };


  const columns = [
    {
      key: "imageUrl",
      label: t("admin.common.image"),
      render: (item: GalleryItem) => item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )
    },
    {
      key: "title",
      label: t("admin.common.title"),
      render: (item: GalleryItem) => (
        <>
          <div className="font-medium text-gray-900">{item.title}</div>
          {item.titleHi && <div className="text-sm text-gray-500">{item.titleHi}</div>}
        </>
      )
    },
    {
      key: "category",
      label: t("admin.common.category"),
      render: (item: GalleryItem) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {CATEGORIES.find((c) => c.value === item.category)?.labelHi || item.category || "-"}
        </span>
      )
    },
    {
      key: "isActive",
      label: t("admin.common.status"),
      render: (item: GalleryItem) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {item.isActive ? t("admin.common.active") : t("admin.common.inactive")}
        </span>
      )
    },
    {
      key: "order",
      label: t("admin.common.order"),
      render: (item: GalleryItem) => <span className="text-sm text-gray-500">{item.order || 0}</span>
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.sidebar.gallery")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.gallery.subtitle")}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="w-4 h-4" /> {t("admin.common.addNew")}
        </button>
      </div>

      {/* Gallery Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CrudTable
          data={items}
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
        title={`${editingId ? t("admin.common.edit") : t("admin.common.addNew")} ${t("admin.sidebar.gallery")}`}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.gallery.basicInfo")}
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
                placeholder={t("admin.gallery.titlePlaceholder")}
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
                placeholder={t("admin.gallery.titleHiPlaceholder")}
              />
            </div>
          </div>

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

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.common.image")} <span className="text-red-500">*</span>
          </h3>
          <ImageUploader
            currentUrl={formData.imageUrl || null}
            onUpload={(url) => handleChange("imageUrl", url)}
            label={t("admin.gallery.image")}
          />
        </div>
      </CrudModal>
    </div>
  );
}
