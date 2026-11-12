import { fieldName } from "@sdxc/bracket-params"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleCheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  RotateCcwIcon,
  TrashIcon,
  TriangleAlertIcon
} from "@sdxc/icons"
import { LazyFrame } from "@sdxc/lazy-frame/ui"
import * as u from "@sdxc/u"
import {
  Badge,
  Button,
  Dialog,
  Drawer,
  Heading,
  Input,
  LinkButton,
  Select,
  Text,
  TextArea
} from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { Handle, RemixNode } from "remix/component"
import type { AdminUser } from "~/app/initializers/auth"
import type { AdminPageDetail, PageRevisionSummary } from "~/app/models/cms"
import {
  BLOCK_TYPE_LABELS,
  BLOCK_TYPES,
  type BlockType,
  type PageBlock
} from "~/app/models/cms-schemas"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminPageEditorPageProps {
  user: AdminUser
  page: AdminPageDetail
  revisions: PageRevisionSummary[]
  previewHref: string
  notice?: string | null
  error?: string | null
  conflictMessage?: string | null
}

function renderTwoColGrid(children: RemixNode) {
  return (
    <div
      mix={[
        u.grid(),
        u.gap(3.5),
        u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }))
      ]}
    >
      {children}
    </div>
  )
}

function renderThreeColGrid(children: RemixNode) {
  return (
    <div
      mix={[
        u.grid(),
        u.gap(3.5),
        u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }))
      ]}
    >
      {children}
    </div>
  )
}

function FieldLabel(handle: Handle<{ label: string; children?: RemixNode }>) {
  return () => (
    <label mix={[u.vstack({ gap: 1.5 })]}>
      <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>{handle.props.label}</Text>
      {handle.props.children}
    </label>
  )
}

function ToneSelect(handle: Handle<{ name: string; current: "default" | "paper" }>) {
  return () => {
    const { name, current } = handle.props
    return (
      <Select name={name}>
        <Select.Option value="default" selected={current === "default"}>
          Default Surface
        </Select.Option>
        <Select.Option value="paper" selected={current === "paper"}>
          Warm Academic Paper
        </Select.Option>
      </Select>
    )
  }
}

function BoolSelect(
  handle: Handle<{
    name: string
    current: boolean
    trueLabel?: string
    falseLabel?: string
  }>
) {
  return () => {
    const { name, current, trueLabel, falseLabel } = handle.props
    return (
      <Select name={name}>
        <Select.Option value="true" selected={current}>
          {trueLabel ?? "Yes (Enabled)"}
        </Select.Option>
        <Select.Option value="false" selected={!current}>
          {falseLabel ?? "No (Hidden)"}
        </Select.Option>
      </Select>
    )
  }
}

function renderBlockFields(block: PageBlock, idx: number) {
  const dp = (...keys: Array<string | number>) => fieldName(["blocks", idx, "data", ...keys])

  switch (block.type) {
    case "notice_bar":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Notice Badge *">
                <Input name={dp("badge")} required defaultValue={block.data.badge} />
              </FieldLabel>
              <FieldLabel label="Notice Message *">
                <Input name={dp("message")} required defaultValue={block.data.message} />
              </FieldLabel>
              <FieldLabel label="CTA Button Label">
                <Input name={dp("ctaLabel")} defaultValue={block.data.ctaLabel} />
              </FieldLabel>
              <FieldLabel label="CTA Link URL">
                <Input name={dp("ctaHref")} defaultValue={block.data.ctaHref} />
              </FieldLabel>
            </>
          )}
        </div>
      )

    case "academic_hero":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          <FieldLabel label="Top Institutional Rubric *">
            <Input name={dp("rubric")} required defaultValue={block.data.rubric} />
          </FieldLabel>
          <FieldLabel label="Masthead Heading *">
            <Input name={dp("heading")} required defaultValue={block.data.heading} />
          </FieldLabel>
          <FieldLabel label="Hero Description *">
            <TextArea
              name={dp("description")}
              rows={3}
              required
              defaultValue={block.data.description}
            />
          </FieldLabel>
          <FieldLabel label="Exam Stream Badges (comma-separated)">
            <Input
              name={dp("streamsCsv")}
              defaultValue={block.data.streams.join(", ")}
              placeholder="TNPSC Group I · II · IV, TNUSRB SI & PC, TET / TRB"
            />
          </FieldLabel>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Primary CTA Label *">
                <Input
                  name={dp("primaryCtaLabel")}
                  required
                  defaultValue={block.data.primaryCtaLabel}
                />
              </FieldLabel>
              <FieldLabel label="Primary CTA URL *">
                <Input
                  name={dp("primaryCtaHref")}
                  required
                  defaultValue={block.data.primaryCtaHref}
                />
              </FieldLabel>
              <FieldLabel label="Secondary CTA Label">
                <Input name={dp("secondaryCtaLabel")} defaultValue={block.data.secondaryCtaLabel} />
              </FieldLabel>
              <FieldLabel label="Secondary CTA URL">
                <Input name={dp("secondaryCtaHref")} defaultValue={block.data.secondaryCtaHref} />
              </FieldLabel>
            </>
          )}
          <details mix={[u.p(3), u.rounded("lg"), u.border({ width: 1, color: "neutral" })]}>
            <summary mix={[u.fontSize("xs"), u.weight("semibold")]}>
              Campus Photo Collage & Plaque Metadata
            </summary>
            <div mix={[u.vstack({ gap: 3 }), u.mbs(3)]}>
              {renderTwoColGrid(
                <>
                  <FieldLabel label="Main Campus Image Path">
                    <Input name={dp("mainImage")} defaultValue={block.data.mainImage} />
                  </FieldLabel>
                  <FieldLabel label="Main Image Alt Text">
                    <Input name={dp("mainImageAlt")} defaultValue={block.data.mainImageAlt} />
                  </FieldLabel>
                  <FieldLabel label="Left Sub-Image Path">
                    <Input name={dp("subImageLeft")} defaultValue={block.data.subImageLeft} />
                  </FieldLabel>
                  <FieldLabel label="Left Sub-Image Alt">
                    <Input name={dp("subImageLeftAlt")} defaultValue={block.data.subImageLeftAlt} />
                  </FieldLabel>
                  <FieldLabel label="Right Sub-Image Path">
                    <Input name={dp("subImageRight")} defaultValue={block.data.subImageRight} />
                  </FieldLabel>
                  <FieldLabel label="Right Sub-Image Alt">
                    <Input
                      name={dp("subImageRightAlt")}
                      defaultValue={block.data.subImageRightAlt}
                    />
                  </FieldLabel>
                  <FieldLabel label="Campus Plaque Label">
                    <Input name={dp("campusLabel")} defaultValue={block.data.campusLabel} />
                  </FieldLabel>
                  <FieldLabel label="Campus Established Badge">
                    <Input name={dp("campusBadge")} defaultValue={block.data.campusBadge} />
                  </FieldLabel>
                </>
              )}
              <FieldLabel label="Campus Address Subtext">
                <Input name={dp("campusSubtext")} defaultValue={block.data.campusSubtext} />
              </FieldLabel>
            </div>
          </details>
        </div>
      )

    case "page_banner": {
      const crumbsWithBlank = [...block.data.breadcrumbs, { label: "", href: "" }]
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Banner Rubric *">
                <Input name={dp("rubric")} required defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Page Title *">
                <Input name={dp("title")} required defaultValue={block.data.title} />
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Subtitle / Description">
            <TextArea name={dp("description")} rows={2} defaultValue={block.data.description} />
          </FieldLabel>
          <div mix={[u.vstack({ gap: 2 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Breadcrumb Trail (leave last row blank to ignore)
            </Text>
            {crumbsWithBlank.map((crumb, cIdx) => (
              <div
                key={`crumb-${cIdx}`}
                mix={[
                  u.grid(),
                  u.gap(2.5),
                  u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1fr" }))
                ]}
              >
                <Input
                  name={dp("breadcrumbs", cIdx, "label")}
                  defaultValue={crumb.label}
                  placeholder="Crumb label (e.g. Courses)"
                />
                <Input
                  name={dp("breadcrumbs", cIdx, "href")}
                  defaultValue={crumb.href}
                  placeholder="Optional href (e.g. /courses)"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "honour_roll_stats": {
      const metricsWithBlank = [...block.data.metrics, { label: "", count: "", detail: "" }]
      const highlightsWithBlank = [
        ...block.data.highlights,
        { title: "", badge: "", description: "" }
      ]
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Heading">
                <Input name={dp("heading")} defaultValue={block.data.heading} />
              </FieldLabel>
              <FieldLabel label="Action Link Label">
                <Input name={dp("actionLabel")} defaultValue={block.data.actionLabel} />
              </FieldLabel>
              <FieldLabel label="Action Link URL">
                <Input name={dp("actionHref")} defaultValue={block.data.actionHref} />
              </FieldLabel>
            </>
          )}
          <div mix={[u.vstack({ gap: 2 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Impact KPI Metrics (clear label & count to remove; fill blank row to add)
            </Text>
            {metricsWithBlank.map((metric, mIdx) => (
              <div
                key={`metric-${mIdx}`}
                mix={[
                  u.grid(),
                  u.gap(2),
                  u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 0.7fr 1.3fr" }))
                ]}
              >
                <Input
                  name={dp("metrics", mIdx, "label")}
                  defaultValue={metric.label}
                  placeholder="Metric Label (e.g. Total Selections)"
                />
                <Input
                  name={dp("metrics", mIdx, "count")}
                  defaultValue={metric.count}
                  placeholder="Count (e.g. 323+)"
                />
                <Input
                  name={dp("metrics", mIdx, "detail")}
                  defaultValue={metric.detail}
                  placeholder="Supporting detail..."
                />
              </div>
            ))}
          </div>
          <div mix={[u.vstack({ gap: 2 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              State-Rank Plaques / Highlights
            </Text>
            {highlightsWithBlank.map((hl, hIdx) => (
              <div
                key={`hl-${hIdx}`}
                mix={[
                  u.grid(),
                  u.gap(2),
                  u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 0.7fr 1.3fr" }))
                ]}
              >
                <Input
                  name={dp("highlights", hIdx, "title")}
                  defaultValue={hl.title}
                  placeholder="Highlight Title"
                />
                <Input
                  name={dp("highlights", hIdx, "badge")}
                  defaultValue={hl.badge}
                  placeholder="Badge (e.g. State 2nd Rank)"
                />
                <Input
                  name={dp("highlights", hIdx, "description")}
                  defaultValue={hl.description}
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "department_table": {
      const rowsWithBlank = [...block.data.rows, { department: "", count: 0 }]
      const highlightsWithBlank = [
        ...block.data.highlights,
        { title: "", badge: "", description: "" }
      ]
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric *">
                <Input name={dp("rubric")} required defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Section Title *">
                <Input name={dp("title")} required defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
            </>
          )}
          {renderTwoColGrid(
            <>
              <FieldLabel label="Description">
                <Input name={dp("description")} defaultValue={block.data.description} />
              </FieldLabel>
              <FieldLabel label="Anchor ID">
                <Input name={dp("sectionId")} defaultValue={block.data.sectionId} />
              </FieldLabel>
            </>
          )}
          <div mix={[u.vstack({ gap: 2 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Department Selection Rows
            </Text>
            {rowsWithBlank.map((row, rIdx) => (
              <div
                key={`dept-${rIdx}`}
                mix={[
                  u.grid(),
                  u.gap(2),
                  u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "2fr 1fr" }))
                ]}
              >
                <Input
                  name={dp("rows", rIdx, "department")}
                  defaultValue={row.department}
                  placeholder="Department / Exam Board Name"
                />
                <Input
                  name={dp("rows", rIdx, "count")}
                  type="number"
                  defaultValue={String(row.count)}
                  placeholder="Selections Count"
                />
              </div>
            ))}
          </div>
          <div mix={[u.vstack({ gap: 2 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Rank Plaques Above Table (optional)
            </Text>
            {highlightsWithBlank.map((hl, hIdx) => (
              <div
                key={`dhl-${hIdx}`}
                mix={[
                  u.grid(),
                  u.gap(2),
                  u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 0.7fr 1.3fr" }))
                ]}
              >
                <Input
                  name={dp("highlights", hIdx, "title")}
                  defaultValue={hl.title}
                  placeholder="Highlight Title"
                />
                <Input
                  name={dp("highlights", hIdx, "badge")}
                  defaultValue={hl.badge}
                  placeholder="Badge"
                />
                <Input
                  name={dp("highlights", hIdx, "description")}
                  defaultValue={hl.description}
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "pillars_grid": {
      const cardsWithBlank = [
        ...block.data.cards,
        {
          badge: "",
          accent: "none" as const,
          title: "",
          description: "",
          paragraphs: [] as string[],
          values: [] as Array<{ title: string; description: string }>
        }
      ]
      const scheduleWithBlank = [...block.data.scheduleItems, { batch: "", detail: "" }]
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric *">
                <Input name={dp("rubric")} required defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Title *">
                <Input name={dp("title")} required defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Layout Variant">
                <Select name={dp("layout")}>
                  <Select.Option value="three_col" selected={block.data.layout === "three_col"}>
                    3-Column Pillars Grid
                  </Select.Option>
                  <Select.Option value="two_col" selected={block.data.layout === "two_col"}>
                    2-Column Initiatives Grid
                  </Select.Option>
                  <Select.Option
                    value="numbered_with_schedule"
                    selected={block.data.layout === "numbered_with_schedule"}
                  >
                    Numbered Pillars + Batch Schedule
                  </Select.Option>
                  <Select.Option
                    value="vision_mission"
                    selected={block.data.layout === "vision_mission"}
                  >
                    Vision, Mission & Core Values
                  </Select.Option>
                </Select>
              </FieldLabel>
            </>
          )}
          {renderThreeColGrid(
            <>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
              <FieldLabel label="Anchor ID">
                <Input name={dp("sectionId")} defaultValue={block.data.sectionId} />
              </FieldLabel>
              <FieldLabel label="Action Link Label">
                <Input name={dp("actionLabel")} defaultValue={block.data.actionLabel} />
              </FieldLabel>
            </>
          )}
          {renderTwoColGrid(
            <>
              <FieldLabel label="Section Description">
                <Input name={dp("description")} defaultValue={block.data.description} />
              </FieldLabel>
              <FieldLabel label="Action Link URL">
                <Input name={dp("actionHref")} defaultValue={block.data.actionHref} />
              </FieldLabel>
            </>
          )}
          <div mix={[u.vstack({ gap: 2.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Pillar / Vision Cards (leave last blank card empty to ignore)
            </Text>
            {cardsWithBlank.map((card, cIdx) => (
              <div
                key={`card-${cIdx}`}
                mix={[
                  u.vstack({ gap: 2.5 }),
                  u.p(3),
                  u.rounded("lg"),
                  u.border({ width: 1, color: "neutral" })
                ]}
              >
                {renderThreeColGrid(
                  <>
                    <FieldLabel label={`Card #${cIdx + 1} Title`}>
                      <Input
                        name={dp("cards", cIdx, "title")}
                        defaultValue={card.title}
                        placeholder="Card title..."
                      />
                    </FieldLabel>
                    <FieldLabel label="Badge / Eyebrow">
                      <Input name={dp("cards", cIdx, "badge")} defaultValue={card.badge} />
                    </FieldLabel>
                    <FieldLabel label="Border Accent">
                      <Select name={dp("cards", cIdx, "accent")}>
                        <Select.Option value="none" selected={card.accent === "none"}>
                          Standard Border
                        </Select.Option>
                        <Select.Option value="primary" selected={card.accent === "primary"}>
                          Academic Emerald Top
                        </Select.Option>
                        <Select.Option value="gold" selected={card.accent === "gold"}>
                          Honour Gold Top
                        </Select.Option>
                      </Select>
                    </FieldLabel>
                  </>
                )}
                <FieldLabel label="Card Summary">
                  <TextArea
                    name={dp("cards", cIdx, "description")}
                    rows={2}
                    defaultValue={card.description}
                  />
                </FieldLabel>
                {(card.paragraphs.length > 0 || block.data.layout === "vision_mission") && (
                  <FieldLabel label="Extended Paragraphs (separate with blank line)">
                    <TextArea
                      name={dp("cards", cIdx, "paragraphsText")}
                      rows={3}
                      defaultValue={card.paragraphs.join("\n\n")}
                    />
                  </FieldLabel>
                )}
                {card.values.length > 0 && (
                  <div mix={[u.vstack({ gap: 1.5 })]}>
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      Sub-Values List
                    </Text>
                    {card.values.map((val, vIdx) => (
                      <div
                        key={`cval-${cIdx}-${vIdx}`}
                        mix={[
                          u.grid(),
                          u.gap(2),
                          u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 2fr" }))
                        ]}
                      >
                        <Input
                          name={dp("cards", cIdx, "values", vIdx, "title")}
                          defaultValue={val.title}
                        />
                        <Input
                          name={dp("cards", cIdx, "values", vIdx, "description")}
                          defaultValue={val.description}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <details mix={[u.p(3), u.rounded("lg"), u.border({ width: 1, color: "neutral" })]}>
            <summary mix={[u.fontSize("xs"), u.weight("semibold")]}>
              Optional Side Schedule & Campus Photo Panel
            </summary>
            <div mix={[u.vstack({ gap: 3 }), u.mbs(3)]}>
              {renderThreeColGrid(
                <>
                  <FieldLabel label="Schedule Box Title">
                    <Input name={dp("scheduleTitle")} defaultValue={block.data.scheduleTitle} />
                  </FieldLabel>
                  <FieldLabel label="Side Image Path">
                    <Input name={dp("sideImage")} defaultValue={block.data.sideImage} />
                  </FieldLabel>
                  <FieldLabel label="Side Image Alt">
                    <Input name={dp("sideImageAlt")} defaultValue={block.data.sideImageAlt} />
                  </FieldLabel>
                </>
              )}
              <FieldLabel label="Side Image Caption">
                <Input name={dp("sideCaption")} defaultValue={block.data.sideCaption} />
              </FieldLabel>
              {scheduleWithBlank.map((item, sIdx) => (
                <div
                  key={`sched-${sIdx}`}
                  mix={[
                    u.grid(),
                    u.gap(2),
                    u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1.5fr" }))
                  ]}
                >
                  <Input
                    name={dp("scheduleItems", sIdx, "batch")}
                    defaultValue={item.batch}
                    placeholder="Batch timing label..."
                  />
                  <Input
                    name={dp("scheduleItems", sIdx, "detail")}
                    defaultValue={item.detail}
                    placeholder="Schedule details..."
                  />
                </div>
              ))}
            </div>
          </details>
        </div>
      )
    }

    case "rich_prose":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Section Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Section Heading">
                <Input name={dp("title")} defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Lead Description">
            <Input name={dp("description")} defaultValue={block.data.description} />
          </FieldLabel>
          <FieldLabel label="Markdown Prose Body * (Sanitized via @sdxc/markdown)">
            <TextArea name={dp("markdown")} rows={6} required defaultValue={block.data.markdown} />
          </FieldLabel>
        </div>
      )

    case "course_catalog":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Heading">
                <Input name={dp("title")} defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Description">
            <Input name={dp("description")} defaultValue={block.data.description} />
          </FieldLabel>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Category Filter (ALL or Category)">
                <Input name={dp("categoryFilter")} defaultValue={block.data.categoryFilter} />
              </FieldLabel>
              <FieldLabel label="Max Items (0 = All)">
                <Input name={dp("limit")} type="number" defaultValue={String(block.data.limit)} />
              </FieldLabel>
              <FieldLabel label="Anchor ID">
                <Input name={dp("sectionId")} defaultValue={block.data.sectionId} />
              </FieldLabel>
            </>
          )}
          {renderTwoColGrid(
            <>
              <FieldLabel label="Show Section Header">
                <BoolSelect name={dp("showHeader")} current={block.data.showHeader} />
              </FieldLabel>
              <FieldLabel label="Show Category Filter Tabs">
                <BoolSelect name={dp("showCategoryTabs")} current={block.data.showCategoryTabs} />
              </FieldLabel>
              <FieldLabel label="View All Button Label">
                <Input name={dp("viewAllLabel")} defaultValue={block.data.viewAllLabel} />
              </FieldLabel>
              <FieldLabel label="View All Button URL">
                <Input name={dp("viewAllHref")} defaultValue={block.data.viewAllHref} />
              </FieldLabel>
            </>
          )}
        </div>
      )

    case "materials_catalog":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Heading">
                <Input name={dp("title")} defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Layout Mode">
                <Select name={dp("layout")}>
                  <Select.Option value="grid" selected={block.data.layout === "grid"}>
                    Full Public Materials Grid
                  </Select.Option>
                  <Select.Option
                    value="split_with_blogs"
                    selected={block.data.layout === "split_with_blogs"}
                  >
                    Split: Public Notes + Blog Feed
                  </Select.Option>
                </Select>
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Description">
            <Input name={dp("description")} defaultValue={block.data.description} />
          </FieldLabel>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
              <FieldLabel label="Category Filter">
                <Input name={dp("categoryFilter")} defaultValue={block.data.categoryFilter} />
              </FieldLabel>
              <FieldLabel label="Max Materials (0 = All)">
                <Input name={dp("limit")} type="number" defaultValue={String(block.data.limit)} />
              </FieldLabel>
            </>
          )}
          {renderThreeColGrid(
            <>
              <FieldLabel label="Show Category Tabs">
                <BoolSelect name={dp("showCategoryTabs")} current={block.data.showCategoryTabs} />
              </FieldLabel>
              <FieldLabel label="Blog Column Rubric">
                <Input name={dp("blogRubric")} defaultValue={block.data.blogRubric} />
              </FieldLabel>
              <FieldLabel label="Blog Column Heading">
                <Input name={dp("blogTitle")} defaultValue={block.data.blogTitle} />
              </FieldLabel>
            </>
          )}
          <input type="hidden" name={dp("blogLimit")} value={String(block.data.blogLimit)} />
        </div>
      )

    case "gallery_showcase": {
      const videosWithBlank = [...block.data.videos, { src: "", title: "" }]
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Heading">
                <Input name={dp("title")} defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
            </>
          )}
          {renderThreeColGrid(
            <>
              <FieldLabel label="Category Filter">
                <Input name={dp("categoryFilter")} defaultValue={block.data.categoryFilter} />
              </FieldLabel>
              <FieldLabel label="Show Category Tabs">
                <BoolSelect name={dp("showCategoryTabs")} current={block.data.showCategoryTabs} />
              </FieldLabel>
              <FieldLabel label="Description">
                <Input name={dp("description")} defaultValue={block.data.description} />
              </FieldLabel>
            </>
          )}
          {renderThreeColGrid(
            <>
              <FieldLabel label="Videos Rubric">
                <Input name={dp("videosRubric")} defaultValue={block.data.videosRubric} />
              </FieldLabel>
              <FieldLabel label="Videos Heading">
                <Input name={dp("videosTitle")} defaultValue={block.data.videosTitle} />
              </FieldLabel>
              <FieldLabel label="Videos Description">
                <Input name={dp("videosDescription")} defaultValue={block.data.videosDescription} />
              </FieldLabel>
            </>
          )}
          <div mix={[u.vstack({ gap: 2 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Campus Video Recordings
            </Text>
            {videosWithBlank.map((vid, vIdx) => (
              <div
                key={`vid-${vIdx}`}
                mix={[
                  u.grid(),
                  u.gap(2),
                  u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1fr" }))
                ]}
              >
                <Input
                  name={dp("videos", vIdx, "title")}
                  defaultValue={vid.title}
                  placeholder="Video caption..."
                />
                <Input
                  name={dp("videos", vIdx, "src")}
                  defaultValue={vid.src}
                  placeholder="/videos/campus-session-1.mp4"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "blog_feed":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Heading">
                <Input name={dp("title")} defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
            </>
          )}
          {renderThreeColGrid(
            <>
              <FieldLabel label="Show Section Header">
                <BoolSelect name={dp("showHeader")} current={block.data.showHeader} />
              </FieldLabel>
              <FieldLabel label="Max Articles (0 = All)">
                <Input name={dp("limit")} type="number" defaultValue={String(block.data.limit)} />
              </FieldLabel>
              <FieldLabel label="Description">
                <Input name={dp("description")} defaultValue={block.data.description} />
              </FieldLabel>
            </>
          )}
        </div>
      )

    case "faq_accordion": {
      const catsWithBlank = [
        ...block.data.categories,
        { id: "", title: "", items: [{ question: "", answer: "" }] }
      ]
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderThreeColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Heading">
                <Input name={dp("title")} defaultValue={block.data.title} />
              </FieldLabel>
              <FieldLabel label="Surface Tone">
                <ToneSelect name={dp("tone")} current={block.data.tone} />
              </FieldLabel>
            </>
          )}
          {renderThreeColGrid(
            <>
              <FieldLabel label="Show Header">
                <BoolSelect name={dp("showHeader")} current={block.data.showHeader} />
              </FieldLabel>
              <FieldLabel label="Action Label">
                <Input name={dp("actionLabel")} defaultValue={block.data.actionLabel} />
              </FieldLabel>
              <FieldLabel label="Action URL">
                <Input name={dp("actionHref")} defaultValue={block.data.actionHref} />
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Description">
            <Input name={dp("description")} defaultValue={block.data.description} />
          </FieldLabel>
          <div mix={[u.vstack({ gap: 3 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              FAQ Categories & Questions (Automatically generates FAQPage JSON-LD)
            </Text>
            {catsWithBlank.map((cat, cIdx) => {
              const itemsWithBlank =
                cat.title.length > 0 ? [...cat.items, { question: "", answer: "" }] : cat.items
              return (
                <div
                  key={`faq-cat-${cIdx}`}
                  mix={[
                    u.vstack({ gap: 2.5 }),
                    u.p(3),
                    u.rounded("lg"),
                    u.border({ width: 1, color: "neutral" })
                  ]}
                >
                  {renderTwoColGrid(
                    <>
                      <FieldLabel label={`Category #${cIdx + 1} Title`}>
                        <Input
                          name={dp("categories", cIdx, "title")}
                          defaultValue={cat.title}
                          placeholder="e.g. Batch Timings & Scholarships"
                        />
                      </FieldLabel>
                      <FieldLabel label="Category Anchor ID">
                        <Input
                          name={dp("categories", cIdx, "id")}
                          defaultValue={cat.id}
                          placeholder="auto-generated if blank"
                        />
                      </FieldLabel>
                    </>
                  )}
                  {itemsWithBlank.map((qa, qIdx) => (
                    <div
                      key={`faq-qa-${cIdx}-${qIdx}`}
                      mix={[
                        u.grid(),
                        u.gap(2),
                        u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1.5fr" }))
                      ]}
                    >
                      <Input
                        name={dp("categories", cIdx, "items", qIdx, "question")}
                        defaultValue={qa.question}
                        placeholder="Question..."
                      />
                      <Input
                        name={dp("categories", cIdx, "items", qIdx, "answer")}
                        defaultValue={qa.answer}
                        placeholder="Answer..."
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    case "contact_hub":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Office Card Heading">
                <Input name={dp("heading")} defaultValue={block.data.heading} />
              </FieldLabel>
              <FieldLabel label="Form Return Path *">
                <Input name={dp("returnTo")} required defaultValue={block.data.returnTo} />
              </FieldLabel>
              <FieldLabel label="Primary Office Label">
                <Input
                  name={dp("primaryOfficeLabel")}
                  defaultValue={block.data.primaryOfficeLabel}
                />
              </FieldLabel>
              <FieldLabel label="Secondary Office Label">
                <Input
                  name={dp("secondaryOfficeLabel")}
                  defaultValue={block.data.secondaryOfficeLabel}
                />
              </FieldLabel>
              <FieldLabel label="Phone Helpline Label">
                <Input name={dp("phoneLabel")} defaultValue={block.data.phoneLabel} />
              </FieldLabel>
              <FieldLabel label="Email Label">
                <Input name={dp("emailLabel")} defaultValue={block.data.emailLabel} />
              </FieldLabel>
              <FieldLabel label="Operating Hours Label">
                <Input name={dp("hoursLabel")} defaultValue={block.data.hoursLabel} />
              </FieldLabel>
              <FieldLabel label="Display Campus Map Card">
                <BoolSelect name={dp("showMap")} current={block.data.showMap} />
              </FieldLabel>
            </>
          )}
        </div>
      )

    case "admission_form":
      return (
        <div mix={[u.vstack({ gap: 2 })]}>
          <FieldLabel label="Section Surface Tone">
            <ToneSelect name={dp("tone")} current={block.data.tone} />
          </FieldLabel>
          <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
            Hydrates active courses dynamically and issues fresh @sdxc/honeypot anti-spam tokens on
            every request.
          </Text>
        </div>
      )

    case "callout_band":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Rubric">
                <Input name={dp("rubric")} defaultValue={block.data.rubric} />
              </FieldLabel>
              <FieldLabel label="Callout Heading *">
                <Input name={dp("title")} required defaultValue={block.data.title} />
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Description">
            <TextArea name={dp("description")} rows={2} defaultValue={block.data.description} />
          </FieldLabel>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Primary CTA Label">
                <Input name={dp("primaryCtaLabel")} defaultValue={block.data.primaryCtaLabel} />
              </FieldLabel>
              <FieldLabel label="Primary CTA URL">
                <Input name={dp("primaryCtaHref")} defaultValue={block.data.primaryCtaHref} />
              </FieldLabel>
              <FieldLabel label="Secondary CTA Label (blank = Campus Phone)">
                <Input name={dp("secondaryCtaLabel")} defaultValue={block.data.secondaryCtaLabel} />
              </FieldLabel>
              <FieldLabel label="Secondary CTA URL">
                <Input name={dp("secondaryCtaHref")} defaultValue={block.data.secondaryCtaHref} />
              </FieldLabel>
            </>
          )}
        </div>
      )

    case "entity_detail_main":
      return (
        <div mix={[u.vstack({ gap: 3.5 })]}>
          {renderTwoColGrid(
            <>
              <FieldLabel label="Bound Collection Entity">
                <Select name={dp("entityKind")}>
                  <Select.Option value="course" selected={block.data.entityKind === "course"}>
                    Course Detail (/courses/:slug)
                  </Select.Option>
                  <Select.Option value="blog" selected={block.data.entityKind === "blog"}>
                    Blog Article (/blogs/:slug)
                  </Select.Option>
                </Select>
              </FieldLabel>
              <FieldLabel label="Bottom CTA Heading">
                <Input name={dp("ctaHeading")} defaultValue={block.data.ctaHeading} />
              </FieldLabel>
              <FieldLabel label="Bottom CTA Subtext">
                <Input name={dp("ctaSubtext")} defaultValue={block.data.ctaSubtext} />
              </FieldLabel>
              <FieldLabel label="Bottom CTA Button Label">
                <Input name={dp("ctaLabel")} defaultValue={block.data.ctaLabel} />
              </FieldLabel>
            </>
          )}
          <FieldLabel label="Bottom CTA URL">
            <Input name={dp("ctaHref")} defaultValue={block.data.ctaHref} />
          </FieldLabel>
        </div>
      )
  }
}

export function AdminPageEditorPage(handle: Handle<AdminPageEditorPageProps>) {
  return () => {
    const {
      user,
      page,
      revisions,
      previewHref,
      notice = null,
      error = null,
      conflictMessage = null
    } = handle.props

    const patchUrl = routes.admin.pageBlockPatch.href({ id: page.id })

    return (
      <AdminLayout user={user} currentPath={routes.admin.pages.href()}>
        <PageHeader
          crumbsLabel="Breadcrumb"
          crumbs={[
            { label: "Admin", href: routes.admin.index.href() },
            { label: "Page Builder", href: routes.admin.pages.href() },
            { label: page.title }
          ]}
          title={page.title}
          description={`Slug: ${page.slug} · Draft v${page.version} · ${
            page.publishedVersion > 0
              ? `Published Live v${page.publishedVersion}`
              : "Unpublished Draft"
          }`}
          status={
            page.status === "draft" ? (
              <Badge color="warning" variant="outline">
                Draft Only
              </Badge>
            ) : page.hasUnpublishedChanges ? (
              <Badge color="warning" variant="secondary">
                Unpublished Edits
              </Badge>
            ) : (
              <Badge color="success" variant="secondary">
                Published Live
              </Badge>
            )
          }
          actions={
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
              <Button
                variant="outline"
                color="neutral"
                commandfor="live-preview-dialog"
                command="show-modal"
              >
                <EyeIcon size={15} />
                <span>Live Preview</span>
              </Button>
              <LinkButton href={previewHref} variant="ghost" color="neutral">
                <span>?preview=draft</span>
                <ExternalLinkIcon size={13} />
              </LinkButton>
              <Button
                variant="outline"
                color="neutral"
                commandfor="revision-history-drawer"
                command="show-modal"
              >
                <RotateCcwIcon size={15} />
                <span>Revisions ({revisions.length})</span>
              </Button>
            </div>
          }
        />

        {notice && (
          <div
            role="status"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "success" }),
              u.bg("success.tint")
            ]}
          >
            <CircleCheckIcon size={18} mix={[u.fg("success"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("success"), u.m(0)]}>
              {notice}
            </Text>
          </div>
        )}

        {conflictMessage && (
          <div
            role="alert"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "warning" }),
              u.bg("warning.tint")
            ]}
          >
            <TriangleAlertIcon size={18} mix={[u.fg("warning"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("warning"), u.m(0)]}>
              {conflictMessage}
            </Text>
          </div>
        )}

        {error && (
          <div
            role="alert"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "danger" }),
              u.bg("danger.tint")
            ]}
          >
            <TriangleAlertIcon size={18} mix={[u.fg("danger"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("danger"), u.m(0)]}>
              {error}
            </Text>
          </div>
        )}

        {/* Atomic Publish Bar */}
        <form
          method="POST"
          action={routes.admin.pagePublish.href({ id: page.id })}
          mix={[
            u.hstack({ gap: 3, align: "end", justify: "between" }),
            u.flexWrap("wrap"),
            u.p(4),
            u.rounded("xl"),
            u.border({ width: 1, color: "brand" }),
            u.bg("brand.tint")
          ]}
        >
          <input type="hidden" name="expectedVersion" value={String(page.version)} />
          <div mix={[u.vstack({ gap: 1 }), u.grow(1), u.minWidth("16rem")]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Publish Draft v{page.version} to Live Public Website
            </Text>
            <Input
              name="note"
              placeholder="Release summary (e.g. Added Group IV 2027 timetable & FAQ)"
            />
          </div>
          <Button type="submit" color="brand" variant="solid">
            Publish Live (v{page.publishedVersion + 1})
          </Button>
        </form>

        {/* Block Order & Quick Actions (@sdxc/json-patch + Add Block) */}
        <section
          mix={[
            u.vstack({ gap: 3.5 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <div
            mix={[u.hstack({ gap: 2, align: "center", justify: "between" }), u.flexWrap("wrap")]}
          >
            <div mix={[u.vstack({ gap: 0.5 })]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Block Structure & Order ({page.draftBlocks.length} Blocks)
              </Heading>
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                Reorder, toggle visibility, duplicate, or insert institutional blocks (powered by
                RFC 6902 JSON Patch with optimistic version checks).
              </Text>
            </div>
          </div>

          {/* Add Block Form */}
          <form
            method="POST"
            action={routes.admin.pageBlockAdd.href({ id: page.id })}
            mix={[
              u.hstack({ gap: 2.5, align: "end" }),
              u.flexWrap("wrap"),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, style: "dashed", color: "neutral" }),
              u.bg("var(--ui-bg)")
            ]}
          >
            <input type="hidden" name="expectedVersion" value={String(page.version)} />
            <div mix={[u.grow(1), u.minWidth("15rem")]}>
              <FieldLabel label="Insert Institutional Block">
                <Select name="blockType">
                  {BLOCK_TYPES.map((bt: BlockType) => (
                    <Select.Option key={bt} value={bt} selected={bt === "rich_prose"}>
                      {BLOCK_TYPE_LABELS[bt]} ({bt})
                    </Select.Option>
                  ))}
                </Select>
              </FieldLabel>
            </div>
            <div mix={[u.minWidth("10rem")]}>
              <FieldLabel label="Placement">
                <Select name="position">
                  <Select.Option value="end" selected>
                    Append at Bottom
                  </Select.Option>
                  <Select.Option value="start">Insert at Top</Select.Option>
                </Select>
              </FieldLabel>
            </div>
            <Button type="submit" color="brand" variant="outline">
              <PlusIcon size={15} />
              <span>Add Block</span>
            </Button>
          </form>

          {/* Per-block JSON-Patch action rows */}
          <div mix={[u.vstack({ gap: 2 })]}>
            {page.draftBlocks.map((blk, idx) => (
              <div
                key={blk.id}
                mix={[
                  u.hstack({ gap: 2.5, align: "center", justify: "between" }),
                  u.flexWrap("wrap"),
                  u.pi(3.5),
                  u.pb(2.5),
                  u.rounded("lg"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-bg)")
                ]}
              >
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Badge color="neutral" variant="outline">
                    #{idx + 1}
                  </Badge>
                  <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                    {BLOCK_TYPE_LABELS[blk.type]}
                  </Text>
                  <code mix={[u.fontSize("xs"), u.fg("neutral.muted")]}>{blk.id}</code>
                  {!blk.enabled && (
                    <Badge color="warning" variant="outline">
                      Hidden
                    </Badge>
                  )}
                  {blk.visibilityRule && (
                    <Badge color="brand" variant="outline">
                      Rule: {blk.visibilityRule}
                    </Badge>
                  )}
                </div>

                <div mix={[u.hstack({ gap: 1.5, align: "center" }), u.flexWrap("wrap")]}>
                  <form method="POST" action={patchUrl} mix={[u.m(0)]}>
                    <input type="hidden" name="expectedVersion" value={String(page.version)} />
                    <input type="hidden" name="patchAction" value="move_up" />
                    <input type="hidden" name="blockIndex" value={String(idx)} />
                    <Button
                      type="submit"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      disabled={idx === 0}
                      aria-label={`Move block ${idx + 1} up`}
                      title="Move Up"
                    >
                      <ArrowUpIcon size={14} />
                    </Button>
                  </form>

                  <form method="POST" action={patchUrl} mix={[u.m(0)]}>
                    <input type="hidden" name="expectedVersion" value={String(page.version)} />
                    <input type="hidden" name="patchAction" value="move_down" />
                    <input type="hidden" name="blockIndex" value={String(idx)} />
                    <Button
                      type="submit"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      disabled={idx === page.draftBlocks.length - 1}
                      aria-label={`Move block ${idx + 1} down`}
                      title="Move Down"
                    >
                      <ArrowDownIcon size={14} />
                    </Button>
                  </form>

                  <form method="POST" action={patchUrl} mix={[u.m(0)]}>
                    <input type="hidden" name="expectedVersion" value={String(page.version)} />
                    <input type="hidden" name="patchAction" value="toggle" />
                    <input type="hidden" name="blockIndex" value={String(idx)} />
                    <Button
                      type="submit"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      aria-label={blk.enabled ? "Disable block" : "Enable block"}
                      title={blk.enabled ? "Disable block" : "Enable block"}
                    >
                      {blk.enabled ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                    </Button>
                  </form>

                  <form method="POST" action={patchUrl} mix={[u.m(0)]}>
                    <input type="hidden" name="expectedVersion" value={String(page.version)} />
                    <input type="hidden" name="patchAction" value="duplicate" />
                    <input type="hidden" name="blockIndex" value={String(idx)} />
                    <Button
                      type="submit"
                      variant="outline"
                      color="neutral"
                      size="sm"
                      aria-label="Duplicate block"
                      title="Duplicate block"
                    >
                      <CopyIcon size={14} />
                    </Button>
                  </form>

                  <form method="POST" action={patchUrl} mix={[u.m(0)]}>
                    <input type="hidden" name="expectedVersion" value={String(page.version)} />
                    <input type="hidden" name="patchAction" value="remove" />
                    <input type="hidden" name="blockIndex" value={String(idx)} />
                    <Button
                      type="submit"
                      variant="outline"
                      color="danger"
                      size="sm"
                      aria-label="Remove block"
                      title="Remove block"
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Page Metadata, SEO & Block Field Composer (@sdxc/bracket-params) */}
        <form
          method="POST"
          action={routes.admin.pageDraftSave.href({ id: page.id })}
          mix={[u.vstack({ gap: 5 })]}
        >
          <input type="hidden" name="expectedVersion" value={String(page.version)} />

          {/* Page Title & SEO Card */}
          <section
            mix={[
              u.vstack({ gap: 3.5 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              Page Identity & Search Metadata
            </Heading>

            {renderTwoColGrid(
              <>
                <FieldLabel label="Internal / Masthead Title *">
                  <Input name="title" required defaultValue={page.title} />
                </FieldLabel>
                <FieldLabel label="SEO <title> Tag *">
                  <Input
                    name={fieldName(["seo", "title"])}
                    required
                    defaultValue={page.seo.title}
                  />
                </FieldLabel>
              </>
            )}

            <FieldLabel label="SEO Meta Description">
              <TextArea
                name={fieldName(["seo", "description"])}
                rows={2}
                defaultValue={page.seo.description}
              />
            </FieldLabel>

            {renderThreeColGrid(
              <>
                <FieldLabel label="Canonical Path">
                  <Input
                    name={fieldName(["seo", "canonicalPath"])}
                    defaultValue={page.seo.canonicalPath}
                  />
                </FieldLabel>
                <FieldLabel label="Social Share Image (og:image)">
                  <Input
                    name={fieldName(["seo", "ogImage"])}
                    defaultValue={page.seo.ogImage}
                    placeholder="/images/paart-training-hall-front.png"
                  />
                </FieldLabel>
                <FieldLabel label="Search Engine Indexing">
                  <BoolSelect
                    name={fieldName(["seo", "noindex"])}
                    current={page.seo.noindex}
                    trueLabel="Noindex (Exclude from Google & Sitemap)"
                    falseLabel="Indexable (Include in Google & Sitemap)"
                  />
                </FieldLabel>
              </>
            )}
          </section>

          {/* Individual Block Field Cards */}
          {page.draftBlocks.map((block, idx) => (
            <section
              key={`editor-${block.id}`}
              mix={[
                u.vstack({ gap: 4 }),
                u.p(5),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <input type="hidden" name={fieldName(["blocks", idx, "id"])} value={block.id} />
              <input type="hidden" name={fieldName(["blocks", idx, "type"])} value={block.type} />

              <div
                mix={[
                  u.hstack({ gap: 3, align: "center", justify: "between" }),
                  u.flexWrap("wrap"),
                  u.pbe(3),
                  u.borderEdge("bottom", { width: 1, color: "neutral" })
                ]}
              >
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Badge color="brand">Block #{idx + 1}</Badge>
                  <Heading level={3} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                    {BLOCK_TYPE_LABELS[block.type]}
                  </Heading>
                  <code mix={[u.fontSize("xs"), u.fg("neutral.muted")]}>{block.type}</code>
                </div>

                <div mix={[u.hstack({ gap: 3, align: "center" }), u.flexWrap("wrap")]}>
                  <FieldLabel label="Status">
                    <BoolSelect
                      name={fieldName(["blocks", idx, "enabled"])}
                      current={block.enabled}
                      trueLabel="Enabled"
                      falseLabel="Disabled (Hidden)"
                    />
                  </FieldLabel>
                  <FieldLabel label="Visibility Expression (@sdxc/expression)">
                    <Input
                      name={fieldName(["blocks", idx, "visibilityRule"])}
                      defaultValue={block.visibilityRule}
                      placeholder='Optional, e.g. role == "aspirant" or now <= "2027-06-30"'
                    />
                  </FieldLabel>
                </div>
              </div>

              {renderBlockFields(block, idx)}
            </section>
          ))}

          <div
            mix={[
              u.hstack({ gap: 3, align: "center", justify: "end" }),
              u.p(4),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Button type="submit" color="brand" variant="solid">
              Save Draft Changes ( Leaves Live Site Unchanged )
            </Button>
          </div>
        </form>

        {/* Live Draft Preview Modal (@sdxc/lazy-frame inside native <dialog>) */}
        <Dialog
          id="live-preview-dialog"
          aria-labelledby="live-preview-dialog-title"
          mix={[u.maxWidth("70rem"), u.width("full")]}
        >
          <Dialog.Header>
            <Dialog.Title id="live-preview-dialog-title">
              Live Draft Preview ({previewHref})
            </Dialog.Title>
            <Dialog.Description>
              Renders unpublished draft blocks with robots="noindex, nofollow" and Cache-Control:
              private, no-store.
            </Dialog.Description>
          </Dialog.Header>

          <div mix={[u.vstack({ gap: 3 }), u.p(4)]}>
            <div
              mix={[
                u.rounded("lg"),
                u.border({ width: 1, color: "neutral" }),
                u.overflow("auto"),
                u.maxHeight("34rem"),
                u.p(3)
              ]}
            >
              <LazyFrame
                src={previewHref}
                loadOn="open"
                fallback={
                  <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                    Loading live server-rendered draft preview…
                  </Text>
                }
              >
                <LinkButton href={previewHref} variant="outline" color="brand">
                  <span>Open Draft Preview ({previewHref})</span>
                  <ExternalLinkIcon size={14} />
                </LinkButton>
              </LazyFrame>
            </div>
          </div>

          <Dialog.Footer>
            <LinkButton href={previewHref} variant="outline" color="neutral">
              <span>Open in Full Tab</span>
              <ExternalLinkIcon size={14} />
            </LinkButton>
            <Button commandfor="live-preview-dialog" command="close" color="brand" variant="solid">
              Close Preview
            </Button>
          </Dialog.Footer>

          <Dialog.Close commandfor="live-preview-dialog" aria-label="Close preview" />
        </Dialog>

        {/* Revision Audit Log & 1-Click Rollback Drawer */}
        <Drawer
          id="revision-history-drawer"
          placement="right"
          aria-labelledby="revision-drawer-title"
        >
          <Drawer.Header>
            <Drawer.Title id="revision-drawer-title">
              Revision History & Rollback ({revisions.length})
            </Drawer.Title>
            <Drawer.Description>
              Immutable snapshots recorded on every publish and rollback with Administrator
              authorship.
            </Drawer.Description>
          </Drawer.Header>

          <div mix={[u.vstack({ gap: 3 }), u.p(4), u.overflow("auto")]}>
            {revisions.length === 0 ? (
              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                No published revisions recorded yet. Publish your draft to create v1.
              </Text>
            ) : (
              revisions.map((rev) => (
                <div
                  key={rev.id}
                  mix={[
                    u.vstack({ gap: 2 }),
                    u.p(3.5),
                    u.rounded("lg"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-bg)")
                  ]}
                >
                  <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
                    <Badge
                      color={rev.version === page.publishedVersion ? "success" : "neutral"}
                      variant="secondary"
                    >
                      Revision v{rev.version}
                      {rev.version === page.publishedVersion ? " (Current Live)" : ""}
                    </Badge>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      {rev.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC
                    </Text>
                  </div>

                  <Text mix={[u.fontSize("sm"), u.weight("medium"), u.m(0)]}>{rev.note}</Text>

                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    By {rev.authorName}
                    {rev.authorEmail ? ` (${rev.authorEmail})` : ""} · {rev.blocks.length} blocks ·{" "}
                    {rev.diffOpsCount} diff ops
                  </Text>

                  <form
                    method="POST"
                    action={routes.admin.pageRevisionRestore.href({
                      id: page.id,
                      revisionId: rev.id
                    })}
                    mix={[u.m(0)]}
                  >
                    <Button type="submit" variant="outline" color="brand" size="sm">
                      <RotateCcwIcon size={13} />
                      <span>Restore Revision v{rev.version}</span>
                    </Button>
                  </form>
                </div>
              ))
            )}
          </div>

          <Drawer.Footer>
            <Button
              commandfor="revision-history-drawer"
              command="close"
              variant="outline"
              color="neutral"
            >
              Close
            </Button>
          </Drawer.Footer>

          <Drawer.Close commandfor="revision-history-drawer" aria-label="Close revisions drawer" />
        </Drawer>
      </AdminLayout>
    )
  }
}
