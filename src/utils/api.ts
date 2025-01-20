import { request } from '@/utils/http.ts'

export async function apiRequest<T>(url: string): Promise<T> {
  const response = await request(url)

  if (!response.success) {
    throw response
  }

  return response.data as T
}
