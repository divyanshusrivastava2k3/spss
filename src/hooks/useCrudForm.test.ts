import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCrudForm } from '@/hooks/useCrudForm';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import axios from 'axios';
import { toast } from 'react-hot-toast';

interface TestEntity {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
}

interface TestFormData {
  title: string;
  description: string;
  isActive: boolean;
  order: number;
}

const initialFormData: TestFormData = {
  title: '',
  description: '',
  isActive: true,
  order: 0,
};

const mockEntities: TestEntity[] = [
  { id: '1', title: 'Entity 1', description: 'Description 1', isActive: true, order: 1 },
  { id: '2', title: 'Entity 2', description: 'Description 2', isActive: false, order: 2 },
];

describe('hooks/useCrudForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (axios.get as any).mockResolvedValue({ data: mockEntities });
    (axios.post as any).mockResolvedValue({ data: { id: '3', ...initialFormData, title: 'New Entity' } });
    (axios.put as any).mockResolvedValue({ data: { id: '1', ...initialFormData, title: 'Updated Entity' } });
    (axios.delete as any).mockResolvedValue({});
  });

  it('should fetch entities on initialization', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.entities).toEqual(mockEntities);
    expect(axios.get).toHaveBeenCalledWith('/api/test');
  });

  it('should open create form with initial data', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openCreate();
    });

    expect(result.current.isFormOpen).toBe(true);
    expect(result.current.editingId).toBeNull();
    expect(result.current.formData).toEqual(initialFormData);
  });

  it('should open edit form with entity data', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openEdit(mockEntities[0]);
    });

    expect(result.current.isFormOpen).toBe(true);
    expect(result.current.editingId).toBe('1');
    expect(result.current.formData.title).toBe('Entity 1');
    expect(result.current.formData.description).toBe('Description 1');
  });

  it('should close form and reset state', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openEdit(mockEntities[0]);
    });

    act(() => {
      result.current.closeForm();
    });

    expect(result.current.isFormOpen).toBe(false);
    expect(result.current.editingId).toBeNull();
    expect(result.current.formData).toEqual(initialFormData);
  });

  it('should handle field changes', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleChange('title', 'New Title');
    });

    expect(result.current.formData.title).toBe('New Title');
  });

  it('should create new entity on submit', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openCreate();
    });

    act(() => {
      result.current.handleChange('title', 'New Entity');
      result.current.handleChange('description', 'New Description');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(axios.post).toHaveBeenCalledWith('/api/test', {
      title: 'New Entity',
      description: 'New Description',
      isActive: true,
      order: 0,
    });
    expect(toast.success).toHaveBeenCalledWith('Created successfully!');
  });

  it('should update existing entity on submit', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openEdit(mockEntities[0]);
    });

    act(() => {
      result.current.handleChange('title', 'Updated Entity');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(axios.put).toHaveBeenCalledWith('/api/test/1', {
      title: 'Updated Entity',
      description: 'Description 1',
      isActive: true,
      order: 1,
    });
    expect(toast.success).toHaveBeenCalledWith('Updated successfully!');
  });

  it('should delete entity', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    await act(async () => {
      await result.current.handleDelete('1');
    });

    expect(axios.delete).toHaveBeenCalledWith('/api/test/1');
    expect(toast.success).toHaveBeenCalledWith('Deleted successfully!');

    window.confirm = originalConfirm;
  });

  it('should not delete if user cancels', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    window.confirm = vi.fn(() => false);

    await act(async () => {
      await result.current.handleDelete('1');
    });

    expect(axios.delete).not.toHaveBeenCalled();

    window.confirm = vi.fn(() => true);
  });

  it('should auto-generate slug from title when provided', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData & { slug: string }>({
        apiEndpoint: '/api/test',
        initialFormData: { ...initialFormData, slug: '' },
        generateSlug: (title) => title.toLowerCase().replace(/\s+/g, '-'),
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openCreate();
    });

    act(() => {
      result.current.handleChange('title', 'My New Post');
      result.current.handleChange('slug', '');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(axios.post).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        slug: 'my-new-post',
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (axios.post as any).mockRejectedValueOnce({
      response: {
        data: { error: 'Validation failed', details: { fieldErrors: { title: ['Required'] } } },
        status: 400,
      },
    });

    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openCreate();
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('Validation failed')
    );
    consoleSpy.mockRestore();
  });

  it('should toggle publish status', async () => {
    const { result } = renderHook(() =>
      useCrudForm<TestEntity, TestFormData>({
        apiEndpoint: '/api/test',
        initialFormData,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.togglePublish('1', true);
    });

    expect(axios.put).toHaveBeenCalledWith('/api/test/1', { isActive: false });
    expect(toast.success).toHaveBeenCalledWith('Deactivated/Unpublished!');
  });
});