/**
 * Client entry islands shipped by `@sdxc/ui` and local interactive components,
 * keyed by their bare module specifier so the Remix 3 browser runtime can hydrate them.
 */
export const PACKAGE_MODULES: Record<string, () => Promise<unknown>> = {
  "@sdxc/ui/app/app-shell-toggle": () => import("@sdxc/ui/app/app-shell-toggle"),
  "@sdxc/ui/app/detail-sheet": () => import("@sdxc/ui/app/detail-sheet"),
  "@sdxc/ui/app/filter-bar": () => import("@sdxc/ui/app/filter-bar"),
  "@sdxc/ui/app/table": () => import("@sdxc/ui/app/table"),
  "@sdxc/ui/app/toasts": () => import("@sdxc/ui/app/toasts"),
  "@sdxc/ui/confirm": () => import("@sdxc/ui/confirm"),
  "@sdxc/ui/dialog-dismiss": () => import("@sdxc/ui/dialog-dismiss"),
  "@sdxc/ui/relative-time": () => import("@sdxc/ui/relative-time")
}
