import type { DocumentAssets } from "@sdxc/assets-middleware"
import type { Handle, RemixNode } from "remix/component"
import { Seo, type SchemaOrg } from "@sdxc/seo"
import * as u from "@sdxc/u"
import { ImportMap } from "remix/component/server"
import { getContext } from "remix/middleware/async-context"
import { DEFAULT_DESCRIPTION, seo, SITE_URL } from "~/app/initializers/seo"
import { readThemeCookie, type Theme } from "~/resources/components/theme-toggle"
import "~/resources/css/theme.css"

export namespace Document {
  export interface Props {
    children?: RemixNode
    assets: DocumentAssets
    title?: string
    description?: string
    canonical?: string
    robots?: string
    og?: Seo.OpenGraph
    schema?: SchemaOrg.Node | SchemaOrg.Node[]
    head?: RemixNode
    theme?: Theme
  }
}

export type DocumentProps = Document.Props

export function Document(handle: Handle<Document.Props>) {
  return () => {
    const {
      children,
      head,
      title = "PAART Academy — Competitive Exam Coaching & Career Guidance",
      description = DEFAULT_DESCRIPTION,
      canonical,
      robots,
      og,
      schema,
      assets,
      theme
    } = handle.props
    const { script, stylesheets, nonce } = assets

    const ctx = getContext()
    const resolvedTheme = theme ?? readThemeCookie(ctx?.request?.headers?.get("Cookie"))
    const requestUrl = ctx?.request ? new URL(ctx.request.url) : null
    const canonicalUrl = canonical ?? (requestUrl ? seo.canonical(requestUrl) : SITE_URL)
    const isAdminWorkspace = Boolean(requestUrl?.pathname.startsWith("/admin"))

    let resolvedRobots = robots
    if (resolvedRobots === undefined && isAdminWorkspace) {
      resolvedRobots = seo.robotsTag({ index: false, follow: false })
    }

    return (
      <html
        lang="en"
        data-theme={resolvedTheme}
        data-workspace={isAdminWorkspace ? "admin" : undefined}
        class={resolvedTheme}
        data-rmx-preserve-attrs="data-theme class data-workspace"
        mix={[u.when("&:has(dialog:modal)", u.overflow("hidden"))]}
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..700&family=Noto+Sans+Tamil:wght@400..700&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..700&display=swap"
          />
          <Seo
            site={seo.site}
            title={title}
            description={description}
            canonical={canonicalUrl}
            robots={resolvedRobots}
            og={og}
            schema={schema}
          />
          <ImportMap value={script.importMap} nonce={nonce} />
          {script.preloads.map((href) => (
            <link key={href} rel="modulepreload" href={href} data-rmx-key={href} />
          ))}
          {stylesheets.length > 0 ? (
            stylesheets.map((href) => (
              <link key={href} rel="stylesheet" href={href} data-rmx-key={href} />
            ))
          ) : (
            <link
              rel="stylesheet"
              href="/resources/css/theme.css"
              data-rmx-key="/resources/css/theme.css"
            />
          )}
          {head}
        </head>
        <body mix={[u.m(0)]}>
          {children}
          <script type="module" async src={script.href}></script>
        </body>
      </html>
    )
  }
}
