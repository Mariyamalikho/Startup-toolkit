import { useEffect } from 'react'

interface PageMetadataOptions {
  title: string
  description?: string
  canonicalPath?: string
}

const BASE_URL = 'https://startup-toolkit-three.vercel.app'
const DEFAULT_TITLE = 'Startup Toolkit | Lean Venture Ideation & Validation Workspace'
const DEFAULT_DESCRIPTION =
  'Integrated lean startup workspace: customer Empathy Mapping, Osterwalder 9-Box Business Model Canvas, hypothesis experiments, prototype roadmap, and 1-click investor pitch deck exports.'

/**
 * Dynamically updates document title, meta description, and canonical tag
 * on route changes to ensure search engines and browser history index each page accurately.
 */
export function usePageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
}: PageMetadataOptions) {
  useEffect(() => {
    // 1. Update Document Title
    if (!title) {
      document.title = DEFAULT_TITLE
    } else if (title.includes('Startup Toolkit')) {
      document.title = title
    } else {
      document.title = `${title} | Startup Toolkit`
    }

    // 2. Update Meta Description
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = description

    // 3. Update OpenGraph Title & Description
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    if (ogTitle) ogTitle.content = document.title

    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    if (ogDescription) ogDescription.content = description

    // 4. Update Canonical Link
    if (canonicalPath) {
      const canonicalUrl = `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.rel = 'canonical'
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.href = canonicalUrl

      const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
      if (ogUrl) ogUrl.content = canonicalUrl
    }
  }, [title, description, canonicalPath])
}
