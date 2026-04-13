function getMostPopulousCountries(regionCountries: typeof countries, count: number) {
  return regionCountries
    .filter(country => country.independent)
    .sort((a, b) => b.population - a.population)
    .slice(0, count)
}

function getAllCountries(regionCountries: typeof countries) {
  return regionCountries.filter(country => country.independent)
}

function getAllTerritories(regionCountries: typeof countries) {
  return regionCountries.filter(country => !country.independent)
}

const worldCountries = countries
const africaCountries = countries.filter(country => country.region === 'Africa')
const americasCountries = countries.filter(country => country.region === 'Americas')
const asiaCountries = countries.filter(country => country.region === 'Asia')
const europeCountries = countries.filter(country => country.region === 'Europe')
const oceaniaCountries = countries.filter(country => country.region === 'Oceania')

export const playableRegions = [
  {
    slug: 'world',
    title: 'World',
    description: 'A full run with flags from every region around the globe.',
    img: '/img/world.svg',
    color: 'blue',
    games: [
      {
        slug: 'most-populous-10',
        title: '10 most populous countries',
        countries: getMostPopulousCountries(worldCountries, 10),
      },
      {
        slug: 'most-populous-25',
        title: '25 most populous countries',
        countries: getMostPopulousCountries(worldCountries, 25),
      },
      {
        slug: 'most-populous-50',
        title: '50 most populous countries',
        countries: getMostPopulousCountries(worldCountries, 50),
      },
      {
        slug: 'most-populous-100',
        title: '100 most populous countries',
        countries: getMostPopulousCountries(worldCountries, 100),
      },
      {
        slug: 'all-countries',
        title: 'All countries',
        countries: getAllCountries(worldCountries),
      },
      {
        slug: 'all-territories',
        title: 'All territories',
        countries: getAllTerritories(worldCountries),
      },
      {
        slug: 'all-countries-and-territories',
        title: 'All countries and territories',
        countries: worldCountries,
      },
    ],
  },
  {
    slug: 'africa',
    title: 'Africa',
    description: 'Bold palettes and several flags that are easy to mix-up.',
    img: '/img/africa.svg',
    color: 'yellow',
    games: [
      {
        slug: 'most-populous-10',
        title: '10 most populous countries',
        countries: getMostPopulousCountries(africaCountries, 10),
      },
      {
        slug: 'most-populous-25',
        title: '25 most populous countries',
        countries: getMostPopulousCountries(africaCountries, 25),
      },
      {
        slug: 'all-countries',
        title: 'All countries',
        countries: getAllCountries(africaCountries),
      },
      {
        slug: 'all-territories',
        title: 'All territories',
        countries: getAllTerritories(africaCountries),
      },
      {
        slug: 'all-countries-and-territories',
        title: 'All countries and territories',
        countries: africaCountries,
      },
    ],
  },
  {
    slug: 'americas',
    title: 'Americas',
    description: 'North, Central, South America and the Caribbean.',
    img: '/img/americas.svg',
    color: 'green',
    games: [
      {
        slug: 'most-populous-10',
        title: '10 most populous countries',
        countries: getMostPopulousCountries(americasCountries, 10),
      },
      {
        slug: 'most-populous-25',
        title: '25 most populous countries',
        countries: getMostPopulousCountries(americasCountries, 25),
      },
      {
        slug: 'all-countries',
        title: 'All countries',
        countries: getAllCountries(americasCountries),
      },
      {
        slug: 'all-territories',
        title: 'All territories',
        countries: getAllTerritories(americasCountries),
      },
      {
        slug: 'all-countries-and-territories',
        title: 'All countries and territories',
        countries: americasCountries,
      },
    ],
  },
  {
    slug: 'asia',
    title: 'Asia',
    description: 'Wide stylistic range, from simple tricolors to ornate emblems.',
    img: '/img/asia.svg',
    color: 'orange',
    games: [
      {
        slug: 'most-populous-10',
        title: '10 most populous countries',
        countries: getMostPopulousCountries(asiaCountries, 10),
      },
      {
        slug: 'most-populous-25',
        title: '25 most populous countries',
        countries: getMostPopulousCountries(asiaCountries, 25),
      },
      {
        slug: 'all-countries',
        title: 'All countries',
        countries: getAllCountries(asiaCountries),
      },
      {
        slug: 'all-countries-and-territories',
        title: 'All countries and territories',
        countries: asiaCountries,
      },
    ],
  },
  {
    slug: 'europe',
    title: 'Europe',
    description: 'Many closely related patterns that reward careful comparison.',
    img: '/img/europe.svg',
    color: 'red',
    games: [
      {
        slug: 'most-populous-10',
        title: '10 most populous countries',
        countries: getMostPopulousCountries(europeCountries, 10),
      },
      {
        slug: 'most-populous-25',
        title: '25 most populous countries',
        countries: getMostPopulousCountries(europeCountries, 25),
      },
      {
        slug: 'all-countries',
        title: 'All countries',
        countries: getAllCountries(europeCountries),
      },
      {
        slug: 'all-territories',
        title: 'All territories',
        countries: getAllTerritories(europeCountries),
      },
      {
        slug: 'all-countries-and-territories',
        title: 'All countries and territories',
        countries: europeCountries,
      },
    ],
  },
  {
    slug: 'oceania',
    title: 'Oceania',
    description: 'Australia, New Zealand, Melanesia, Micronesia, and Polynesia.',
    img: '/img/oceania.svg',
    color: 'pink',
    games: [
      {
        slug: 'most-populous-10',
        title: '10 most populous countries',
        countries: getMostPopulousCountries(oceaniaCountries, 10),
      },
      {
        slug: 'all-countries',
        title: 'All countries',
        countries: getAllCountries(oceaniaCountries),
      },
      {
        slug: 'all-territories',
        title: 'All territories',
        countries: getAllTerritories(oceaniaCountries),
      },
      {
        slug: 'all-countries-and-territories',
        title: 'All countries and territories',
        countries: oceaniaCountries,
      },
    ],
  },
] as const
