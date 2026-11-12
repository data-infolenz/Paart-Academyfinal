import { MemoryCache } from "@sdxc/cache/memory"

export const CMS_CHROME_KEY = "chrome:default"

export function cmsPageKey(slug: string): string {
  return `page:${slug}`
}

let activeCache = new MemoryCache()

export function getCmsCache(): MemoryCache {
  return activeCache
}

export async function purgePageCache(slug: string): Promise<void> {
  await activeCache.delete(cmsPageKey(slug))
}

export async function purgeChromeCache(): Promise<void> {
  await activeCache.delete(CMS_CHROME_KEY)
}

export function resetCmsCache(): void {
  activeCache = new MemoryCache()
}
