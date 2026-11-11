import { db } from "~/app/initializers/database"
import { appConfig } from "~/config/app"
import { TRUST_PROFILE } from "~/config/trust"
import { siteSettings, type SiteSettingsRow } from "~/database/schema"

export interface SiteSettings {
  siteName: string
  phone: string
  whatsapp: string
  email: string
  addressPrimary: string
  addressSecondary: string
  hours: string
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: TRUST_PROFILE.shortName,
  phone: TRUST_PROFILE.phone,
  whatsapp: TRUST_PROFILE.whatsapp,
  email: TRUST_PROFILE.email,
  addressPrimary: TRUST_PROFILE.addressPrimary,
  addressSecondary: TRUST_PROFILE.addressSecondary,
  hours: TRUST_PROFILE.hours,
  seoTitle: "PAART Academy | TNPSC, TNUSRB & Competitive Exam Coaching in Puliyangudi",
  seoDescription: TRUST_PROFILE.summary,
  canonicalUrl: appConfig.PAART_PUBLIC_URL
}

function mapSettingsRow(row: SiteSettingsRow): SiteSettings {
  return {
    siteName: row.site_name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    addressPrimary: row.address_primary,
    addressSecondary: row.address_secondary,
    hours: row.hours,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalUrl: row.canonical_url
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await db.find(siteSettings, "default")
    return row ? mapSettingsRow(row) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function upsertSiteSettings(input: Omit<SiteSettings, "canonicalUrl">): Promise<void> {
  const existing = await db.find(siteSettings, "default")
  const now = new Date()
  if (existing) {
    await db.update(siteSettings, "default", {
      site_name: input.siteName,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      address_primary: input.addressPrimary,
      address_secondary: input.addressSecondary,
      hours: input.hours,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
      updated_at: now
    })
  } else {
    await db.create(siteSettings, {
      id: "default",
      site_name: input.siteName,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      address_primary: input.addressPrimary,
      address_secondary: input.addressSecondary,
      hours: input.hours,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
      canonical_url: appConfig.PAART_PUBLIC_URL,
      updated_at: now
    })
  }
}
