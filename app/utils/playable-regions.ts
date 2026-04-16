function getMostPopulousCountries(regionCountries: typeof countries, count: number) {
  return regionCountries
    .filter(country => country.independent)
    .sort((a, b) => b.population - a.population)
    .slice(0, count)
}

function getLargestCountriesByArea(regionCountries: typeof countries, count: number) {
  return regionCountries
    .filter(country => country.independent)
    .sort((a, b) => b.area - a.area)
    .slice(0, count)
}

function getAllCountries(regionCountries: typeof countries) {
  return regionCountries.filter(country => country.independent)
}

function getAllTerritories(regionCountries: typeof countries) {
  return regionCountries.filter(country => !country.independent)
}

function getCountriesBySubregion(subregion: string) {
  return countries.filter(country => country.independent && country.subregion === subregion)
}

const worldCountries = countries
const africaCountries = countries.filter(country => country.region === 'Africa')
const americasCountries = countries.filter(country => country.region === 'Americas')
const asiaCountries = countries.filter(country => country.region === 'Asia')
const europeCountries = countries.filter(country => country.region === 'Europe')
const oceaniaCountries = countries.filter(country => country.region === 'Oceania')
const unionJackCountryNames = [
  'Australia',
  'Cook Islands',
  'Fiji',
  'New Zealand',
  'Niue',
  'Tuvalu',
  'United Kingdom',
  'Anguilla',
  'Bermuda',
  'British Indian Ocean Territory',
  'British Virgin Islands',
  'Cayman Islands',
  'Falkland Islands',
  'Heard Island and McDonald Islands',
  'Montserrat',
  'Pitcairn Islands',
  'Saint Helena, Ascension and Tristan da Cunha',
  'South Georgia',
  'Turks and Caicos Islands',
] as const
const crescentCountryNames = [
  'Cocos (Keeling) Islands',
  'Western Sahara',
  'Algeria',
  'Azerbaijan',
  'Comoros',
  'Libya',
  'Malaysia',
  'Maldives',
  'Mauritania',
  'Pakistan',
  'Singapore',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Uzbekistan',
] as const
const microstateCountryNames = [
  'Andorra',
  'Liechtenstein',
  'Monaco',
  'San Marino',
  'Vatican City',
  'Malta',
  'Luxembourg',
  'Nauru',
  'Palau',
  'Niue',
  'Cook Islands',
  'Tuvalu',
  'Saint Kitts and Nevis',
  'Barbados',
  'Antigua and Barbuda',
  'Grenada',
  'Saint Vincent and the Grenadines',
  'Singapore',
  'Bahrain',
] as const

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
        slug: 'largest-countries-10',
        title: '10 largest countries by area',
        countries: getLargestCountriesByArea(worldCountries, 10),
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
        slug: 'countries-and-territories-antarctica',
        title: 'Countries and territories of Antarctica',
        countries: countries.filter(country => country.region === 'Antarctic'),
      },
      {
        slug: 'union-jack-flags',
        title: 'Union Jack Flags',
        countries: countries.filter(country => unionJackCountryNames.includes(country.name.common as typeof unionJackCountryNames[number])),
      },
      {
        slug: 'crescent-flags',
        title: 'Crescent Flags',
        countries: countries.filter(country => crescentCountryNames.includes(country.name.common as typeof crescentCountryNames[number])),
      },
      {
        slug: 'microstates',
        title: 'Microstates',
        countries: countries.filter(country => microstateCountryNames.includes(country.name.common as typeof microstateCountryNames[number])),
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
        slug: 'countries-eastern-africa',
        title: 'Countries of Eastern Africa',
        countries: getCountriesBySubregion('Eastern Africa'),
      },
      {
        slug: 'countries-middle-africa',
        title: 'Countries of Middle Africa',
        countries: getCountriesBySubregion('Middle Africa'),
      },
      {
        slug: 'countries-northern-africa',
        title: 'Countries of Northern Africa',
        countries: getCountriesBySubregion('Northern Africa'),
      },
      {
        slug: 'countries-southern-africa',
        title: 'Countries of Southern Africa',
        countries: getCountriesBySubregion('Southern Africa'),
      },
      {
        slug: 'countries-western-africa',
        title: 'Countries of Western Africa',
        countries: getCountriesBySubregion('Western Africa'),
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
        slug: 'countries-caribbean',
        title: 'Countries of the Caribbean',
        countries: getCountriesBySubregion('Caribbean'),
      },
      {
        slug: 'countries-and-territories-caribbean',
        title: 'Countries and territories of the Caribbean',
        countries: countries.filter(country => country.subregion === 'Caribbean'),
      },
      {
        slug: 'countries-central-america',
        title: 'Countries of Central America',
        countries: getCountriesBySubregion('Central America'),
      },
      {
        slug: 'countries-north-america',
        title: 'Countries of North America',
        countries: getCountriesBySubregion('North America'),
      },
      {
        slug: 'countries-south-america',
        title: 'Countries of South America',
        countries: getCountriesBySubregion('South America'),
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
        slug: 'countries-eastern-and-south-eastern-asia',
        title: 'Countries of Eastern and South-Eastern Asia',
        countries: countries.filter(country =>
          country.independent
          && (country.subregion === 'Eastern Asia' || country.subregion === 'South-Eastern Asia')),
      },
      {
        slug: 'countries-western-asia',
        title: 'Countries of Western Asia',
        countries: getCountriesBySubregion('Western Asia'),
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
        slug: 'countries-eastern-and-southeast-europe',
        title: 'Countries of Eastern and Southeast Europe',
        countries: countries.filter(country =>
          country.independent
          && (country.subregion === 'Eastern Europe' || country.subregion === 'Southeast Europe')),
      },
      {
        slug: 'countries-western-europe',
        title: 'Countries of Western Europe',
        countries: getCountriesBySubregion('Western Europe'),
      },
      {
        slug: 'countries-western-central-and-southern-europe',
        title: 'Countries of Western, Central and Southern Europe',
        countries: countries.filter(country =>
          country.independent
          && (country.subregion === 'Western Europe'
            || country.subregion === 'Central Europe'
            || country.subregion === 'Southern Europe')),
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
