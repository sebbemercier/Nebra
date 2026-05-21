export type HealthResponse = {
  status: 'ok' | 'degraded'
  service: string
  version: string
}

export type TokenResponse = {
  access_token: string
  token_type: 'bearer'
}

export type UserRegisterPayload = {
  email: string
  full_name: string
  password: string
}

export type Asset = {
  id: string
  name: string
  asset_type: string
  serial_number: string
  location: string
  status: 'stock' | 'deployed' | 'maintenance' | 'archived'
  warranty_expiry: string | null
  hardware_info: any | null
  owner_id: string
  assigned_user_id: string | null
  created_at: string
}

export type AssetActivity = {
  id: string
  action: string
  details: string | null
  actor_id: string
  created_at: string
}

export type AssetCreatePayload = {
  name: string
  asset_type: string
  serial_number: string
  location: string
  status?: string
  warranty_expiry?: string | null
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...init,
  })

  if (!response.ok) {
    const detail = await response
      .json()
      .then((payload) => payload?.detail ?? `API request failed with status ${response.status}`)
      .catch(() => `API request failed with status ${response.status}`)

    throw new Error(String(detail))
  }

  return (await response.json()) as T
}

export const apiClient = {
  getHealth: () => request<HealthResponse>('/api/v1/health'),
  register: (payload: UserRegisterPayload) =>
    request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (email: string, password: string) => {
    const body = new URLSearchParams({
      username: email,
      password,
    })
    return request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  },
  listAssets: (token: string) =>
    request<Asset[]>('/api/v1/assets', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createAsset: (payload: AssetCreatePayload, token: string) =>
    request<Asset>('/api/v1/assets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  checkoutAsset: (assetId: string, assignedUserId: string, token: string, details?: string) =>
    request<Asset>(`/api/v1/assets/${assetId}/checkout?assigned_user_id=${assignedUserId}${details ? `&details=${details}` : ''}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
  checkinAsset: (assetId: string, token: string, details?: string) =>
    request<Asset>(`/api/v1/assets/${assetId}/checkin${details ? `?details=${details}` : ''}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
  getAssetHistory: (assetId: string, token: string) =>
    request<AssetActivity[]>(`/api/v1/assets/${assetId}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateAsset: (assetId: string, payload: Partial<AssetCreatePayload>, token: string) =>
    request<Asset>(`/api/v1/assets/${assetId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
}
