export interface ApiRequest {
  url: string
  method: string
  headers: Record<string, string>
  body: string
  timestamp?: string
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  time: number
  size: number
}

export interface SavedRequest {
  id: string
  name: string
  request: ApiRequest
  createdAt: string
}

export interface EnvironmentVariable {
  key: string
  value: string
}
