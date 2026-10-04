'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function CacheCleanEngine() {
  const pathname = usePathname();

  // Core Cache & Memory Cleaning Procedure
  const purgeStaleCache = useCallback(async () => {
    try {
      // 1. Purge Web Cache API if available
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((name) => {
            // Delete old asset/runtime caches
            if (name.includes('next') || name.includes('workbox') || name.includes('temp')) {
              return caches.delete(name);
            }
            return Promise.resolve(false);
          })
        );
      }

      // 2. Clean temporary sessionStorage entries
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.startsWith('temp_') || key.startsWith('cache_') || key.includes('next'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => sessionStorage.removeItem(key));
      }

      // 3. Clear lingering image/blob object URLs
      const win = window as unknown as { gc?: () => void };
      if (typeof win !== 'undefined' && typeof win.gc === 'function') {
        try {
          win.gc();
        } catch {}
      }
    } catch {}
  }, []);

  // Run cache cleaning on initial mount & on route changes
  useEffect(() => {
    purgeStaleCache();
  }, [pathname, purgeStaleCache]);

  // Handle Tab Visibility - pause background processes when inactive to free RAM
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        purgeStaleCache();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [purgeStaleCache]);

  return null;
}
