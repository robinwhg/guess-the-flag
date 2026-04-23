export function formatRegionTitle(regionSlug: string) {
  if (regionSlug === 'world')
    return 'the World'

  if (regionSlug === 'americas')
    return 'the Americas'

  return regionSlug.charAt(0).toUpperCase() + regionSlug.slice(1)
}

export function calculateAccuracy(totalCorrectQuestions: number, totalQuestions: number) {
  if (!totalQuestions)
    return 0

  return Math.floor((totalCorrectQuestions / totalQuestions) * 100)
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')

  const seconds = (totalSeconds % 60)
    .toString()
    .padStart(2, '0')

  return `${minutes}:${seconds}`
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatLocalDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value))
}
