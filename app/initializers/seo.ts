import { createSeo, type SchemaOrg } from "@sdxc/seo"
import { appConfig } from "~/config/app"
import { TRUST_PROFILE } from "~/config/trust"

export const SITE_URL = appConfig.PAART_PUBLIC_URL.replace(/\/+$/, "")
export const SITE_NAME = "PAART Academy"
export const DEFAULT_DESCRIPTION = TRUST_PROFILE.summary

export const seo = createSeo({
  baseUrl: SITE_URL,
  siteName: SITE_NAME,
  defaultDescription: DEFAULT_DESCRIPTION,
  twitter: {
    card: "summary_large_image"
  }
})

export function buildEducationalOrganizationSchema(trustOverride?: {
  shortName: string
  legalName: string
  establishedDate: string
  summary: string
  phone: string
  email: string
  addressPrimary?: string
}): SchemaOrg.Node {
  const trust = trustOverride ?? TRUST_PROFILE
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: trust.shortName,
    legalName: trust.legalName,
    foundingDate: trust.establishedDate,
    description: trust.summary,
    url: SITE_URL,
    logo: `${SITE_URL}/images/paart-logo.png`,
    telephone: trust.phone,
    email: trust.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: trustOverride?.addressPrimary || "85, Lebbaisaburam Street",
      addressLocality: "Puliyangudi",
      addressRegion: "Tamil Nadu",
      postalCode: "627855",
      addressCountry: "IN"
    }
  } as unknown as SchemaOrg.Node
}

export function buildCourseSchema(course: {
  slug: string
  title: string
  shortDescription: string
  category: string
}): SchemaOrg.Node {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    courseCode: course.category,
    url: `${SITE_URL}/courses/${course.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: TRUST_PROFILE.shortName,
      sameAs: SITE_URL
    }
  } as unknown as SchemaOrg.Node
}

export function buildArticleSchema(blog: {
  slug: string
  title: string
  shortDescription: string
  publishedDate: string
  author: string
}): SchemaOrg.Article {
  return seo.schema.article({
    headline: blog.title,
    description: blog.shortDescription,
    url: `${SITE_URL}/blogs/${blog.slug}`,
    datePublished: blog.publishedDate,
    author: {
      name: blog.author,
      url: SITE_URL,
      kind: "Organization"
    },
    publisher: {
      name: TRUST_PROFILE.shortName
    }
  })
}

export function buildFaqSchema(
  questions: Array<{ question: string; answer: string }>
): SchemaOrg.FAQPage {
  return seo.schema.faq(questions)
}
