"use client";

import { toast } from "react-hot-toast";
import { useTranslation } from "@/lib/translation-context";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useCrudForm } from "@/hooks/useCrudForm";
import { formatDateForInput } from "@/lib/date-utils";
import { CrudTable } from '@/components/admin/CrudTable';
import { CrudModal } from '@/components/admin/CrudModal';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  titleHi?: string;
  slug: string;
  excerpt?: string;
  excerptHi?: string;
  content: string;
  contentHi?: string;
  featuredImage?: string;
  author?: string;
  authorHi?: string;
  publishedAt?: string;
  isPublished: boolean;
  tags?: string;
  category?: string;
  categoryHi?: string;
  language?: string;
  views?: number;
  createdAt?: string;
}

interface BlogFormData {
  title: string;
  titleHi: string;
  slug: string;
  excerpt: string;
  excerptHi: string;
  content: string;
  contentHi: string;
  featuredImage: string;
  author: string;
  authorHi: string;
  publishedAt: string;
  isPublished: boolean;
  tags: string;
  category: string;
  categoryHi: string;
  language: string;
}

const initialFormData: BlogFormData = {
  title: "",
  titleHi: "",
  slug: "",
  excerpt: "",
  excerptHi: "",
  content: "",
  contentHi: "",
  featuredImage: "",
  author: "",
  authorHi: "",
  publishedAt: "",
  isPublished: false,
  tags: "",
  category: "",
  categoryHi: "",
  language: "en",
};

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function AdminBlogPage() {
  const { t } = useTranslation();

  const {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities: posts,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  } = useCrudForm<BlogPost, BlogFormData>({
    apiEndpoint: "/api/blog",
    initialFormData,
    generateSlug: slugify,
    transformPayload: (data) => ({
      ...data,
      slug: data.slug || slugify(data.title),
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : new Date().toISOString(),
    })
  });



  const columns = [
    {
      key: "featuredImage",
      label: t("admin.common.image"),
      render: (p: BlogPost) => p.featuredImage ? (
        <img src={p.featuredImage} alt={p.title} className="w-16 h-16 object-cover rounded-lg" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )
    },
    {
      key: "title",
      label: t("admin.common.title"),
      render: (p: BlogPost) => (
        <>
          <div className="font-medium text-gray-900">{p.title}</div>
          {p.titleHi && <div className="text-sm text-gray-500">{p.titleHi}</div>}
          <div className="text-xs text-gray-400 mt-1">Slug: {p.slug}</div>
        </>
      )
    },
    {
      key: "category",
      label: t("admin.common.category"),
      render: (p: BlogPost) => (
        <span className="text-sm text-gray-500">{p.categoryHi || p.category || "-"}</span>
      )
    },
    {
      key: "author",
      label: t("admin.common.author"),
      render: (p: BlogPost) => (
        <span className="text-sm text-gray-500">{p.authorHi || p.author || "-"}</span>
      )
    },
    {
      key: "isPublished",
      label: t("admin.common.published"),
      render: (p: BlogPost) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${p.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {p.isPublished ? t("admin.common.published") : t("admin.common.draft")}
        </span>
      )
    },
    {
      key: "views",
      label: t("admin.common.views"),
      render: (p: BlogPost) => <span className="text-sm text-gray-500">{p.views || 0}</span>
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.sidebar.blog")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.blog.subtitle") || "Write and manage your blog posts."}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <Plus className="w-4 h-4" /> {t("admin.common.addNew")}
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CrudTable
          data={posts}
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
        title={`${editingId ? t("admin.common.edit") : t("admin.common.addNew")} ${t("admin.sidebar.blog")}`}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        size="max-w-4xl"
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.blog.basicInfo")}
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
                placeholder={t("admin.blog.titlePlaceholder")}
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
                placeholder={t("admin.blog.titleHiPlaceholder")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.slug")}</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("admin.blog.slugPlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.language")}</label>
              <select
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.excerpt")}</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.excerptHi")}</label>
              <textarea
                value={formData.excerptHi}
                onChange={(e) => handleChange("excerptHi", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.common.content")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.contentHi")}</label>
            <textarea
              value={formData.contentHi}
              onChange={(e) => handleChange("contentHi", e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.common.image")}
          </h3>
          <ImageUploader
            currentUrl={formData.featuredImage || null}
            onUpload={(url) => handleChange("featuredImage", url)}
            label={t("admin.blog.featuredImage")}
          />
        </div>

        {/* Meta Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {t("admin.blog.metaInfo")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.author")}</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.authorHi")}</label>
              <input
                type="text"
                value={formData.authorHi}
                onChange={(e) => handleChange("authorHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.category")}</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.categoryHi")}</label>
              <input
                type="text"
                value={formData.categoryHi}
                onChange={(e) => handleChange("categoryHi", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.tags")}</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.common.publishedAt")}</label>
              <input
                type="date"
                value={formData.publishedAt ? formatDateForInput(formData.publishedAt) : ""}
                onChange={(e) => handleChange("publishedAt", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => handleChange("isPublished", e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="text-sm text-gray-700">{t("admin.common.isPublished")}</label>
          </div>
        </div>
      </CrudModal>
    </div>
  );
}