import { request } from '@/utils/http.ts'

export async function apiRequest<T>(url: string): Promise<T> {
  try {
    const response = await request(url)
    if (!response.success) {
      throw new Error((response as ErrorResponse).message)
    }
    return response.data as T

  } catch (error) {
    console.error(error)
    return null
  }
}
