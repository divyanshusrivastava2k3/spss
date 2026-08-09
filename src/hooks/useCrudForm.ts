"use client";

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface UseCrudFormOptions<TEntity, TFormData> {
  /** API endpoint for CRUD operations */
  apiEndpoint: string;
  /** Initial form data */
  initialFormData: TFormData;
  /** Function to generate slug from title (optional) */
  generateSlug?: (title: string) => string;
  /** Called after successful create/update */
  onSuccess?: (entity: TEntity, isEditing: boolean) => void;
  /** Called after successful delete */
  onDeleteSuccess?: () => void;
  /** Optional payload transformer before submit */
  transformPayload?: (data: TFormData) => any;
}

interface UseCrudFormReturn<TEntity, TFormData> {
  /** Current form data */
  formData: TFormData;
  /** ID of entity being edited (null if creating new) */
  editingId: string | null;
  /** Whether form modal is open */
  isFormOpen: boolean;
  /** Whether a create/update operation is in progress */
  isSubmitting: boolean;
  /** Whether a delete operation is in progress */
  isDeleting: boolean;
  /** Whether data is being fetched */
  isLoading: boolean;
  /** List of all entities */
  entities: TEntity[];
  /** Open form for creating new entity */
  openCreate: () => void;
  /** Open form for editing existing entity */
  openEdit: (entity: TEntity) => void;
  /** Close form and reset state */
  closeForm: () => void;
  /** Handle form field changes */
  handleChange: (field: keyof TFormData, value: any) => void;
  /** Handle form submission (create or update) */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** Handle entity deletion */
  handleDelete: (id: string) => Promise<void>;
  /** Refresh entities list from server */
  fetchEntities: () => Promise<void>;
  /** Toggle publish status */
  togglePublish: (id: string, currentStatus: boolean, field?: string) => Promise<void>;
}

/**
 * Generic CRUD form hook for admin pages
 * Handles form state, API calls, and toast notifications
 */
export function useCrudForm<TEntity extends { id: string }, TFormData extends Record<string, any>>({
  apiEndpoint,
  initialFormData,
  generateSlug,
  onSuccess,
  onDeleteSuccess,
  transformPayload,
}: UseCrudFormOptions<TEntity, TFormData>): UseCrudFormReturn<TEntity, TFormData> {
  const [formData, setFormData] = useState<TFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [entities, setEntities] = useState<TEntity[]>([]);

  const fetchEntities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(apiEndpoint);
      setEntities(response.data);
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => { fetchEntities(); }, [fetchEntities]);

  const openCreate = useCallback(() => {
    setFormData(initialFormData);
    setEditingId(null);
    setIsFormOpen(true);
  }, [initialFormData]);

  const openEdit = useCallback((entity: TEntity) => {
    // Convert entity to form data, handling any type conversions
    const formDataToSet = { ...initialFormData };

    Object.keys(entity).forEach((key) => {
      if (key in formDataToSet) {
        const value = (entity as any)[key];
        // Handle Date objects
        if (value instanceof Date) {
          formDataToSet[key as keyof TFormData] = value.toISOString().split('T')[0] as any;
        } else {
          formDataToSet[key as keyof TFormData] = (value ?? '') as any;
        }
      }
    });

    setFormData(formDataToSet);
    setEditingId(entity.id);
    setIsFormOpen(true);
  }, [initialFormData]);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = useCallback((field: keyof TFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let submitData = { ...formData } as any;

      // Auto-generate slug if title changed and no slug provided
      if (generateSlug && 'title' in submitData && 'slug' in submitData) {
        const title = submitData['title'] as string;
        const slug = submitData['slug'] as string;
        if (title && (!slug || !editingId)) {
          submitData['slug'] = generateSlug(title);
        }
      }

      if (transformPayload) {
        submitData = transformPayload(submitData);
      }

      let response;
      if (editingId) {
        response = await axios.put(`${apiEndpoint}/${editingId}`, submitData);
        toast.success('Updated successfully!');
      } else {
        response = await axios.post(apiEndpoint, submitData);
        toast.success('Created successfully!');
      }

      onSuccess?.(response.data, !!editingId);
      closeForm();
      await fetchEntities();
    } catch (error: any) {
      console.error('Submit error:', error);
      const message = error.response?.data?.error || 'Operation failed';
      const details = error.response?.data?.details;
      if (details) {
        toast.error(`${message}: ${JSON.stringify(details)}`);
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingId, apiEndpoint, generateSlug, onSuccess, closeForm, fetchEntities, transformPayload]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${apiEndpoint}/${id}`);
      toast.success('Deleted successfully!');
      onDeleteSuccess?.();
      await fetchEntities();
    } catch (error: any) {
      console.error('Delete error:', error);
      const message = error.response?.data?.error || 'Failed to delete';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }, [apiEndpoint, onDeleteSuccess, fetchEntities]);

  const togglePublish = useCallback(async (id: string, currentStatus: boolean, field: string = 'isActive') => {
    try {
      const entity = entities.find(e => e.id === id);
      if (!entity) return;

      await axios.put(`${apiEndpoint}/${id}`, { [field]: !currentStatus });
      toast.success(currentStatus ? 'Deactivated/Unpublished!' : 'Activated/Published!');
      await fetchEntities();
    } catch (error: any) {
      console.error('Toggle publish error:', error);
      toast.error('Failed to update status');
    }
  }, [apiEndpoint, entities, fetchEntities]);

  return {
    formData,
    editingId,
    isFormOpen,
    isSubmitting,
    isDeleting,
    isLoading,
    entities,
    openCreate,
    openEdit,
    closeForm,
    handleChange,
    handleSubmit,
    handleDelete,
    fetchEntities,
    togglePublish,
  };
}