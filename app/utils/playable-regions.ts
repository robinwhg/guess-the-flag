export const playableRegions = [
  {
    slug: 'world',
    title: 'World',
    description: 'Play with all available countries in one run.',
    img: '/img/world.svg',
  },
  {
    slug: 'africa',
    title: 'Africa',
    description: 'Focus on African countries and territories.',
    img: '/img/africa.svg',
  },
  {
    slug: 'americas',
    title: 'Americas',
    description: 'North, Central, South America, and the Caribbean.',
    img: '/img/americas.svg',
  },
  {
    slug: 'asia',
    title: 'Asia',
    description: 'Play countries across Western to Eastern Asia.',
    img: '/img/asia.svg',
  },
  {
    slug: 'europe',
    title: 'Europe',
    description: 'Challenge yourself with European flags.',
    img: '/img/europe.svg',
  },
  {
    slug: 'oceania',
    title: 'Oceania',
    description: 'Includes Australia, Polynesia, Micronesia, and Melanesia.',
    img: '/img/oceania.svg',
  },
] as const

export type PlayableRegionSlug = (typeof playableRegions)[number]['slug']

export const playableRegionSlugs = new Set<string>(
  playableRegions.map(region => region.slug),
)
