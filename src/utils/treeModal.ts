import { isValidUrl, request } from '@/utils/http.ts'

export async function validateUrlInput(value: string) {
  if (!isValidUrl(value)) return false

  const response = await request<Promise<Collection>>(value)
  if (!response.success) return false

  return true
}
