import { useState, useEffect } from 'react'

export const DEFAULT_DEBOUNCE_MS = 500

/**
 * Delays updating a value until the user stops changing it for `delay` ms.
 * Prevents firing redundant API requests on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
