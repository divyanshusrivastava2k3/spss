import React from 'react';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/lib/translation-context';
import { formatDateForInput } from '@/lib/date-utils';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface CrudTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onTogglePublish?: (id: string, currentStatus: boolean) => void;
  isDeleting?: boolean;
}

export function CrudTable<T extends { id: string; isActive?: boolean }>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  onTogglePublish,
  isDeleting,
}: CrudTableProps<T>) {
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">{t("admin.common.loading")}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">
              {t("admin.common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                {t("admin.common.noData")}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      title={t("admin.common.edit")}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {onTogglePublish && typeof item.isActive !== 'undefined' && (
                      <button
                        onClick={() => onTogglePublish(item.id, item.isActive!)}
                        className={`p-2 rounded-lg transition ${
                          item.isActive
                            ? "text-yellow-500 hover:bg-yellow-50"
                            : "text-green-500 hover:bg-green-50"
                        }`}
                        title={item.isActive ? t("admin.common.unpublish") : t("admin.common.publish")}
                      >
                        {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title={t("admin.common.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
