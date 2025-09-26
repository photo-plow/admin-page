export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    day: 'numeric',
    month: 'long',
  })
}

export const formatDateToDotFormat = (isoDate: string): string => {
  const date = new Date(isoDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // месяцы с 0
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function timeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(seconds / 3600)
  const days = Math.floor(seconds / 86400)

  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
}
