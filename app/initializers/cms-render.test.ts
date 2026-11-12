import { renderToString } from "remix/component/server"
import { describe, expect, it } from "vitest"
import type { SessionUser } from "./auth"
import { evaluateBlockVisibility, renderSafeMarkdown } from "./cms-render"

const aspirantUser: SessionUser = {
  id: "u-asp-1",
  email: "aspirant@paart.in",
  name: "M. Karthikeyan",
  fullName: "M. Karthikeyan",
  phone: "+91 9842100222",
  department: "TNPSC Group IV",
  role: "aspirant",
  status: "active",
  mustChangePassword: false
}

describe("cms-render", () => {
  it("renders GFM markdown safely and neutralizes raw <script> tags and javascript: URLs", async () => {
    const source = [
      "## Batch Syllabus Overview",
      "",
      "Classes cover **Samacheer 6th–12th** and [Apply Online](/admissions).",
      "",
      "<script>window.__pwned = true</script>",
      "",
      "Unsafe link: [Click Me](javascript:alert(1)) and ![BadImg](data:text/html,evil)",
      "",
      "| Paper | Marks |",
      "| :--- | ---: |",
      "| General Tamil | 150 |"
    ].join("\n")

    const html = await renderToString(renderSafeMarkdown(source))

    expect(html).toContain("Batch Syllabus Overview")
    expect(html).toContain("<strong>Samacheer 6th–12th</strong>")
    expect(html).toContain('href="/admissions"')
    expect(html).toContain("General Tamil")

    // Raw <script> must be escaped, never rendered as an executable tag
    expect(html).not.toContain("<script>window.__pwned")
    expect(html).toContain("&lt;script&gt;")

    // Unsafe javascript: and data: URLs must be stripped
    expect(html).not.toContain("javascript:alert")
    expect(html).not.toContain("data:text/html")
    expect(html).toContain("Click Me")
  })

  it("evaluates role and date-window visibility expressions accurately", () => {
    expect(evaluateBlockVisibility("")).toBe(true)

    expect(evaluateBlockVisibility('role == "aspirant"', { user: null })).toBe(false)
    expect(evaluateBlockVisibility('role == "aspirant"', { user: aspirantUser })).toBe(true)
    expect(
      evaluateBlockVisibility('ctx.role in ["admin", "aspirant"] and authenticated == true', {
        user: aspirantUser
      })
    ).toBe(true)

    const ruleWindow = 'now >= "2026-06-01" and now <= "2026-12-31"'
    expect(
      evaluateBlockVisibility(ruleWindow, {
        now: new Date("2026-11-12T10:00:00Z")
      })
    ).toBe(true)

    expect(
      evaluateBlockVisibility(ruleWindow, {
        now: new Date("2027-01-05T10:00:00Z")
      })
    ).toBe(false)

    // Invalid rule fails closed
    expect(evaluateBlockVisibility("broken ??? syntax")).toBe(false)
  })
})
