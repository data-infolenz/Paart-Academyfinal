import type { RemixNode } from "remix/component"
import { Markdown } from "@sdxc/markdown"
import { toRemix } from "@sdxc/markdown/remix"
import { isSuccess } from "@sdxc/result"
import * as u from "@sdxc/u"
import type { SessionUser } from "~/app/initializers/auth"
import { normalizeVisibilityExpression, visibilityLanguage } from "~/app/models/cms-schemas"
import { acadSerif } from "~/resources/components/academic-ui"

export function isSafeMarkdownUrl(rawUrl: string): boolean {
  let cleaned = ""
  for (let i = 0; i < rawUrl.length; i++) {
    if (rawUrl.charCodeAt(i) > 0x20) {
      cleaned += rawUrl[i]
    }
  }
  cleaned = cleaned.toLowerCase()
  if (!cleaned) return false
  return (
    cleaned.startsWith("/") ||
    cleaned.startsWith("#") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("http://") ||
    cleaned.startsWith("mailto:") ||
    cleaned.startsWith("tel:")
  )
}

export function renderSafeMarkdown(markdownSource: string): RemixNode {
  const trimmed = markdownSource.trim()
  if (!trimmed) return null

  const parsed = Markdown.parse(trimmed)
  if (!isSuccess(parsed)) {
    return (
      <div mix={[u.fontSize("base"), u.leading("relaxed"), u.fg("var(--acad-ink)")]}>
        <p mix={[u.m(0)]}>{trimmed}</p>
      </div>
    )
  }

  const walked = Markdown.walk(parsed.data.document, {
    link(node) {
      if (!isSafeMarkdownUrl(node.href)) {
        return node.children
      }
      return node
    },
    image(node) {
      if (!isSafeMarkdownUrl(node.src)) {
        return null
      }
      return node
    }
  })

  const doc = isSuccess(walked) ? walked.data : parsed.data.document

  return (
    <div
      mix={[
        u.fontSize("base"),
        u.leading("relaxed"),
        u.fg("var(--acad-ink)"),
        u.when("& h1, & h2, & h3, & h4", [acadSerif(), u.fg("var(--acad-ink)")]),
        u.when("& a", [u.fg("var(--acad-primary)"), u.weight("semibold")]),
        u.when("& table", [
          u.width("full"),
          u.raw({ borderCollapse: "collapse" }),
          u.mbe(4),
          u.fontSize("sm")
        ]),
        u.when("& th, & td", [
          u.p(2.5),
          u.border({ width: 1, color: "var(--acad-border)" }),
          u.textAlign("left")
        ]),
        u.when("& th", [u.bg("var(--acad-paper)"), u.weight("bold")])
      ]}
    >
      {toRemix(doc)}
    </div>
  )
}

export interface VisibilityEvalContext {
  user?: SessionUser | null
  now?: Date
}

export function evaluateBlockVisibility(
  rule: string | undefined | null,
  context: VisibilityEvalContext = {}
): boolean {
  const raw = rule?.trim() ?? ""
  if (!raw) return true

  const nowDate = context.now ?? new Date()
  const evalContext = {
    role: context.user?.role ?? "guest",
    authenticated: Boolean(context.user),
    now: nowDate,
    nowMs: nowDate.getTime(),
    date: nowDate.toISOString().slice(0, 10)
  }

  if (raw.startsWith("{")) {
    try {
      const parsedJson: unknown = JSON.parse(raw)
      const compiled = visibilityLanguage.compile(parsedJson)
      if (!isSuccess(compiled)) return false
      return visibilityLanguage.evaluate(compiled.data, evalContext)
    } catch {
      return false
    }
  }

  const normalized = normalizeVisibilityExpression(raw)
  const parsed = visibilityLanguage.parse(normalized)
  if (!isSuccess(parsed)) return false

  const compiled = visibilityLanguage.compile(parsed.data)
  if (!isSuccess(compiled)) return false

  return visibilityLanguage.evaluate(compiled.data, evalContext)
}
