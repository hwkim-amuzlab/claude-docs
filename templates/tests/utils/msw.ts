import { HttpResponse } from 'msw'

export function apiSuccess<T>(data: T) {
  return HttpResponse.json({
    code: 'OK',
    data,
    message: 'success',
    timestamp: new Date().toISOString(),
  })
}

export function apiError(code = 'ERROR', message = 'error', status = 400) {
  return HttpResponse.json(
    {
      code,
      data: null,
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}
