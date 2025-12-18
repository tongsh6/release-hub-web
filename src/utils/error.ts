import { ElMessage } from 'element-plus'
import { ApiError } from '@/api/http'

let lastKey = ''
let lastAt = 0

/**
 * 全局统一错误出口：
 * - ApiError：展示业务/网络错误信息
 * - 其他错误：兜底展示 message
 */
export function handleError(err: unknown) {
  let message = ''
  let traceId = ''

  if (err instanceof ApiError) {
    message = err.message || '请求失败'
    traceId = err.traceId || ''
  } else {
    message = (err as any)?.message || '未知错误'
  }

  const key = `${message}|${traceId}`
  const now = Date.now()

  if (now - lastAt < 2000 && key === lastKey) {
    return
  }

  lastKey = key
  lastAt = now

  const traceSuffix = traceId ? ` (traceId: ${traceId})` : ''
  ElMessage.error(`${message}${traceSuffix}`)
}
