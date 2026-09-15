/**
 * useNetworkStatus.ts
 *
 * Custom React hook monitoring browser online/offline connectivity status.
 * Provides active connection state and last connection recovery timestamp.
 */

import { useState, useEffect } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  wasOffline: boolean
  lastOnlineAt: Date | null
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [wasOffline, setWasOffline] = useState<boolean>(false)
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(new Date())

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      setLastOnlineAt(new Date())
    }

    function handleOffline() {
      setIsOnline(false)
      setWasOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline, lastOnlineAt }
}
