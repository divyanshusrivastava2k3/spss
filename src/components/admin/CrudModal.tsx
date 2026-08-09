import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/lib/translation-context';

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  size?: string;
  children: React.ReactNode;
}

export function CrudModal({
  isOpen,
  onClose,
  title,
  isSubmitting,
  onSubmit,
  size,
  children,
}: CrudModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto ${size || 'max-w-3xl'}`}>
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {children}

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end gap-3 rounded-b-2xl -mx-6 -mb-6 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                {t("admin.common.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    {t("admin.common.saving")}
                  </>
                ) : (
                  t("admin.common.save")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
