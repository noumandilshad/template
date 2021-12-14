export type ApiErrorResponse = {
  status: string,
  message: string,
  errors?: Record<string, string[]>
}
