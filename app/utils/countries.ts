import rawCountries from '../countries.json'

export interface Country {
  name: {
    common: string
    official: string
    nativeName: Array<{
      lang: string
      official: string
      common: string
    }>
  }
  flag: {
    png: string
    svg: string
    alt: string
    emoji: string
  }
  altSpellings?: string[]
  sovereignState?: string
  hint?: string
  cca3: string
  independent: boolean
  region: string
  subregion: string
  population: number
  area: number
}

export const countries = rawCountries as Country[]

const countryNameByCode = new Map<string, string>(
  countries.map(country => [country.cca3, country.name.common]),
)

export function getSovereignStateName(country: Country): string | null {
  if (!country.sovereignState)
    return null

  return countryNameByCode.get(country.sovereignState) ?? country.sovereignState
}
