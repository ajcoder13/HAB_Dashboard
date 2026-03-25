const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api";

function buildQuery(params?: Record<string, any>) {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return `?${query.toString()}`;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  params?: Record<string, any>,
) {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
