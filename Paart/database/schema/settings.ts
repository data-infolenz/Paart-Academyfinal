import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const siteSettings = table({
  name: "site_settings",
  columns: {
    id: col.text().primaryKey(),
    site_name: col.text().notNull(),
    phone: col.text().notNull(),
    whatsapp: col.text().notNull(),
    email: col.text().notNull(),
    address_primary: col.text().notNull(),
    address_secondary: col.text().notNull().default(""),
    hours: col.text().notNull(),
    seo_title: col.text().notNull(),
    seo_description: col.text().notNull(),
    canonical_url: col.text().notNull(),
    updated_at: col.timestamp().notNull().defaultNow()
  }
})

export type SiteSettingsRow = InferSelect<typeof siteSettings>
export type NewSiteSettingsRow = InferInsert<typeof siteSettings>
