import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Oscar V3'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
