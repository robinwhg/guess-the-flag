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
  sovereignState?: string
  hint?: string
  cca2: string
  cca3: string
  independent: boolean
  altSpellings: string[]
  region: string
  subregion: string
  population: number
  area: number
}

export const countries = rawCountries as Country[]
