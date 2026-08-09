import { z } from "zod";

export const SettingsSchema = z.object({
  ngoName: z.string().min(1),
  ngoNameHi: z.string().min(1),
  logoUrl: z.string(),
  faviconUrl: z.string(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  aboutText: z.string(),
  aboutTextHi: z.string(),
  contactEmail: z.string().email().or(z.literal("")),
  contactPhone: z.string(),
  address: z.string(),
  addressHi: z.string(),
  metaTitle: z.string(),
  metaTitleHi: z.string(),
  metaDescription: z.string(),
  metaDescriptionHi: z.string(),
  facebookUrl: z.string().url().or(z.literal("")),
  twitterUrl: z.string().url().or(z.literal("")),
  instagramUrl: z.string().url().or(z.literal("")),
  youtubeUrl: z.string().url().or(z.literal("")),
  linkedinUrl: z.string().url().or(z.literal("")),
});

export const ProgramSchema = z.object({
  title: z.string().min(1),
  titleHi: z.string().optional().nullable(),
  description: z.string().min(1),
  descriptionHi: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  categoryHi: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable().or(z.literal("")),
  endDate: z.string().datetime().optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export const BlogPostSchema = z.object({
  title: z.string().min(1),
  titleHi: z.string().optional().nullable(),
  slug: z.string().min(1),
  excerpt: z.string(),
  excerptHi: z.string().optional().nullable(),
  content: z.string().min(1),
  contentHi: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  author: z.string(),
  authorHi: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable().or(z.literal("")),
  isPublished: z.boolean().default(false),
  tags: z.string().optional(),
  category: z.string().optional().nullable(),
  categoryHi: z.string().optional().nullable(),
  language: z.string().default("en"),
});

export const PartnerSchema = z.object({
  name: z.string().min(1),
  nameHi: z.string().optional().nullable(),
  logoUrl: z.string().min(1),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  description: z.string().optional().nullable(),
  descriptionHi: z.string().optional().nullable(),
  category: z.string().default("general"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const TeamMemberSchema = z.object({
  name: z.string().min(1),
  nameHi: z.string().optional().nullable(),
  designation: z.string().min(1),
  designationHi: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  bioHi: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
  facebookUrl: z.string().url().optional().nullable().or(z.literal("")),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const GalleryImageSchema = z.object({
  title: z.string().min(1),
  titleHi: z.string().optional().nullable(),
  imageUrl: z.string().min(1),
  category: z.string().optional().nullable(),
  categoryHi: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionHi: z.string().optional().nullable(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const DirectorMessageSchema = z.object({
  directorName: z.string().min(1),
  directorNameHi: z.string().optional().nullable(),
  directorTitle: z.string().min(1),
  directorTitleHi: z.string().optional().nullable(),
  message: z.string().min(1),
  messageHi: z.string().min(1),
  photoUrl: z.string().optional().nullable(),
  signatureUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const HomeContentSchema = z.object({
  heroTitle: z.string(),
  heroTitleHi: z.string(),
  heroSubtitle: z.string(),
  heroSubtitleHi: z.string(),
  heroCtaText: z.string(),
  heroCtaTextHi: z.string(),
  heroCtaLink: z.string(),
  heroBackgroundImage: z.string().optional().nullable(),
  heroImage1: z.string().optional().nullable(),
  heroImage2: z.string().optional().nullable(),
  heroImage3: z.string().optional().nullable(),
  ctaBackgroundImage: z.string().optional().nullable(),
  statsLabel1: z.string(),
  statsLabel1Hi: z.string(),
  statsValue1: z.string(),
  statsLabel2: z.string(),
  statsLabel2Hi: z.string(),
  statsValue2: z.string(),
  statsLabel3: z.string(),
  statsLabel3Hi: z.string(),
  statsValue3: z.string(),
  statsLabel4: z.string(),
  statsLabel4Hi: z.string(),
  statsValue4: z.string(),
  aboutSnippet: z.string().optional().nullable(),
  aboutSnippetHi: z.string().optional().nullable(),
  ctaTitle: z.string(),
  ctaTitleHi: z.string(),
  ctaSubtitle: z.string(),
  ctaSubtitleHi: z.string(),
  ctaPrimaryText: z.string(),
  ctaPrimaryTextHi: z.string(),
  ctaSecondaryText: z.string(),
  ctaSecondaryTextHi: z.string(),
  aboutImage: z.string().optional().nullable(),
  ctaCard1Title: z.string(),
  ctaCard1TitleHi: z.string(),
  ctaCard1Desc: z.string(),
  ctaCard1DescHi: z.string(),
  ctaCard1Image: z.string().optional().nullable(),
  ctaCard2Title: z.string(),
  ctaCard2TitleHi: z.string(),
  ctaCard2Desc: z.string(),
  ctaCard2DescHi: z.string(),
  ctaCard2Image: z.string().optional().nullable(),
  ctaCard3Title: z.string(),
  ctaCard3TitleHi: z.string(),
  ctaCard3Desc: z.string(),
  ctaCard3DescHi: z.string(),
  ctaCard3Image: z.string().optional().nullable(),
  ctaCardLink: z.string(),
  isActive: z.boolean().default(true),
});

export const AboutContentSchema = z.object({
  missionTitle: z.string(),
  missionTitleHi: z.string(),
  missionContent: z.string(),
  missionContentHi: z.string(),
  visionTitle: z.string(),
  visionTitleHi: z.string(),
  visionContent: z.string(),
  visionContentHi: z.string(),
  historyTitle: z.string(),
  historyTitleHi: z.string(),
  historyContent: z.string(),
  historyContentHi: z.string(),
  valuesTitle: z.string(),
  valuesTitleHi: z.string(),
  directorMessageTitle: z.string(),
  directorMessageTitleHi: z.string(),
  teamTitle: z.string(),
  teamTitleHi: z.string(),
  isActive: z.boolean().default(true),
});

export type SettingsFormData = z.infer<typeof SettingsSchema>;
export type ProgramFormData = z.infer<typeof ProgramSchema>;
export type BlogPostFormData = z.infer<typeof BlogPostSchema>;
export type PartnerFormData = z.infer<typeof PartnerSchema>;
export type TeamMemberFormData = z.infer<typeof TeamMemberSchema>;
export type GalleryImageFormData = z.infer<typeof GalleryImageSchema>;
export type DirectorMessageFormData = z.infer<typeof DirectorMessageSchema>;
export type HomeContentFormData = z.infer<typeof HomeContentSchema>;
export type AboutContentFormData = z.infer<typeof AboutContentSchema>;

export function validateBody<T>(schema: z.ZodSchema<T>, body: any) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return { success: false, errors: result.error.flatten() } as const;
  }
  return { success: true, data: result.data } as const;
}
