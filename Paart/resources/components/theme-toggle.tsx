import type { Dispatched, Handle } from "remix/component"
import { MoonIcon, SunIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Button } from "@sdxc/ui"
import { writeCookie } from "@sdxc/ui/utils"
import { clientEntry, on } from "remix/component"

export const THEME_COOKIE = "ui-theme"
export type Theme = "dark" | "light" | "system"

export interface ThemeToggleProps {
  cookieName?: string
  variant?: "outline" | "ghost"
}

export const ThemeToggle = clientEntry(
  import.meta.url,
  function ThemeToggle(handle: Handle<ThemeToggleProps>) {
    async function onToggle(
      _event: Dispatched<PointerEvent, HTMLButtonElement>,
      signal: AbortSignal
    ) {
      const cookieName = handle.props.cookieName ?? THEME_COOKIE
      const root = document.documentElement
      const isDark =
        root.classList.contains("dark") ||
        (!root.classList.contains("light") &&
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      const next: Theme = isDark ? "light" : "dark"

      try {
        writeCookie(cookieName, next)
      } catch {
        // ignore cookie write errors
      }

      root.setAttribute("data-theme", next)
      root.className = next
      if (!signal.aborted) {
        await handle.update()
      }
    }

    return () => (
      <Button
        id="theme-toggle-btn"
        type="button"
        title="Toggle Light / Dark Mode"
        aria-label="Toggle Light / Dark Mode"
        color="neutral"
        variant={handle.props.variant ?? "outline"}
        size="sm"
        mix={[on("click", onToggle)]}
      >
        <span
          mix={[
            u.relative(),
            u.width(4),
            u.height(4),
            u.inlineFlex(),
            u.items("center"),
            u.justify("center")
          ]}
        >
          <span
            mix={[
              u.absolute(),
              u.inset(0),
              u.inlineFlex(),
              u.items("center"),
              u.justify("center"),
              u.opacity(0),
              u.dark([u.opacity(100)])
            ]}
          >
            <SunIcon size={16} />
          </span>
          <span
            mix={[
              u.absolute(),
              u.inset(0),
              u.inlineFlex(),
              u.items("center"),
              u.justify("center"),
              u.opacity(100),
              u.dark([u.opacity(0)])
            ]}
          >
            <MoonIcon size={16} />
          </span>
        </span>
      </Button>
    )
  }
)

export function readThemeCookie(
  cookieHeader: string | null | undefined,
  name = THEME_COOKIE,
  fallback: Theme = "light"
): Theme {
  if (!cookieHeader) return fallback
  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=")
    if (index === -1) continue
    if (part.slice(0, index).trim() !== name) continue
    const value = part.slice(index + 1).trim()
    if (value === "light" || value === "dark" || value === "system") return value
  }
  return fallback
}
