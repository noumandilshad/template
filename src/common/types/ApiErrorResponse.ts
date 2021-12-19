export type ApiErrorResponse = {
  statusCode: string,
  message: string,
  code?: string,
  errors?: Record<string, string[]>
}
