export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}
