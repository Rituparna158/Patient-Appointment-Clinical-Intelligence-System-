const API_BASE = '/api';

export async function api(endpoint: string, options: RequestInit = {}) {
  const clearEndpoint = endpoint.replace(/\/\?/, '?');
  const res = await fetch(`${API_BASE}${clearEndpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  });
  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error('Server did not return json');
  }

  if (!res.ok) {
    console.log('Backend error:', data);
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
