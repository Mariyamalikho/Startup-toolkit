/**
 * retryHandler.ts
 *
 * Async retry utility with exponential backoff for network request resilience.
 * Retries transient network failures, rate limit spikes, and temporary Supabase disconnections
 * before raising end-user errors.
 */

export interface RetryOptions {
  retries?: number
  delayMs?: number
  backoffFactor?: number
  onRetry?: (attempt: number, error: unknown) => void
}

/**
 * Executes an async function with automatic exponential backoff retry logic.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delayMs = 300, backoffFactor = 2, onRetry } = options

  let currentAttempt = 0
  let currentDelay = delayMs

  while (currentAttempt <= retries) {
    try {
      return await fn()
    } catch (err: unknown) {
      currentAttempt++

      if (currentAttempt > retries) {
        throw err
      }

      if (onRetry) {
        onRetry(currentAttempt, err)
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay))
      currentDelay *= backoffFactor
    }
  }

  throw new Error('Retry exhausted without result')
}
