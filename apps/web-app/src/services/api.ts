import { AppError } from '@/lib/error';
import { handleApiError } from '@/lib/handleApiError';

const API_BASE = '/api';

const controllers = new Map<string, AbortController>();

export async function api(endpoint: string, options: RequestInit = {}) {
  try {
    if (controllers.has(endpoint)) {
      controllers.get(endpoint)?.abort();
    }

    const controller = new AbortController();
    controllers.set(endpoint, controller);

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal: controller.signal,
      ...options,
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      // allow empty response
    }

    if (!res.ok) {
      throw new AppError(data?.message || 'Request failed', res.status, 'api');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppError('Request cancelled', undefined, 'network');
    }

    handleApiError(error);
  } finally {
    controllers.delete(endpoint);
  }
}
