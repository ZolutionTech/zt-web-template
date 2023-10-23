export const isNotDefined = <T>(value: T | undefined | null): value is undefined | null =>
  value === undefined || value === null

export const isDefined = <T>(value: T | undefined | null): value is NonNullable<T> =>
  value !== undefined && value !== null

export const isEmpty = (value: string | undefined | null): value is undefined =>
  value === undefined || value === null || value === ''

export const isNotEmpty = (value: string | undefined | null): value is string =>
  value !== undefined && value !== null && value !== ''

export const formatNumberWithSuffix = (number: number) => {
  if (number < 1000) {
    return number
  }

  const suffixes = ['', 'K', 'M', 'B', 'T']
  const suffixNum = Math.floor(('' + number).length / 3)
  let shortValue = parseFloat(
    (suffixNum !== 0 ? number / Math.pow(1000, suffixNum) : number).toPrecision(3)
  )
  if (shortValue % 1 !== 0) {
    shortValue = parseFloat(shortValue.toFixed(2))
  }
  return shortValue + suffixes[suffixNum]
}

export const languageCodeToName = (languageCode: string) => {
  switch (languageCode) {
    case 'en':
      return 'English'
    case 'da':
      return 'Danish'
    case 'th':
      return 'Thai'
    case 'fr':
      return 'French'
    case 'de':
      return 'German'
    case 'es':
      return 'Spanish'
    case 'it':
      return 'Italian'
    case 'nl':
      return 'Dutch'
    case 'pt':
      return 'Portuguese'
    case 'ru':
      return 'Russian'
    case 'ja':
      return 'Japanese'
    case 'zh':
      return 'Chinese'
    case 'cn':
      return 'Chinese'
    case 'ko':
      return 'Korean'
    case 'ar':
      return 'Arabic'
    case 'hi':
      return 'Hindi'
    case 'id':
      return 'Indonesian'
    case 'ms':
      return 'Malay'
    case 'vi':
      return 'Vietnamese'
    case 'tr':
      return 'Turkish'
    case 'pl':
      return 'Polish'
    case 'ro':
      return 'Romanian'
    case 'hu':
      return 'Hungarian'
    case 'cs':
      return 'Czech'
    case 'el':
      return 'Greek'
    case 'he':
      return 'Hebrew'
    case 'no':
      return 'Norwegian'
    case 'sv':
      return 'Swedish'
    case 'fi':
      return 'Finnish'
    case 'uk':
      return 'Ukrainian'
    case 'bg':
      return 'Bulgarian'
    case 'hr':
      return 'Croatian'
    case 'sr':
      return 'Serbian'
    case 'sk':
      return 'Slovak'
    case 'sl':
      return 'Slovenian'
    case 'et':
      return 'Estonian'
    case 'lv':
      return 'Latvian'
    case 'lt':
      return 'Lithuanian'
    case 'fa':
      return 'Persian'
    case 'ur':
      return 'Urdu'
    case 'bn':
      return 'Bengali'
    case 'ta':
      return 'Tamil'
    case 'te':
      return 'Telugu'
    case 'kn':
      return 'Kannada'
    case 'ml':
      return 'Malayalam'
    case 'mr':
      return 'Marathi'
    case 'gu':
      return 'Gujarati'
    case 'pa':
      return 'Punjabi'
    case 'ne':
      return 'Nepali'
    case 'si':
      return 'Sinhala'
    case 'iw':
      return 'Hebrew'
    case 'tl':
      return 'Filipino'
    case 'hy':
      return 'Armenian'
    case 'ka':
      return 'Georgian'
    case 'eu':
      return 'Basque'
    case 'is':
      return 'Icelandic'
    case 'mk':
      return 'Macedonian'
    case 'mt':
      return 'Maltese'
    case 'sq':
      return 'Albanian'
    case 'be':
      return 'Belarusian'
    case 'af':
      return 'Afrikaans'
    case 'sw':
      return 'Swahili'
    case 'hy':
      return 'Armenian'
    default:
      return 'English'
  }
}

export const slugify = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const charMappings = [
    ['æ', 'ae'],
    ['ø', 'oe'],
    ['å', 'aa'],
    ['à', 'a'],
    ['á', 'a'],
    ['â', 'a'],
    ['è', 'e'],
    ['é', 'e'],
    ['ë', 'e'],
    ['ê', 'e'],
    ['ì', 'i'],
    ['í', 'i'],
    ['ï', 'i'],
    ['î', 'i'],
    ['ò', 'o'],
    ['ó', 'o'],
    ['ö', 'o'],
    ['ô', 'o'],
    ['ù', 'u'],
    ['ú', 'u'],
    ['ü', 'u'],
    ['û', 'u'],
    ['ñ', 'n'],
    ['ç', 'c'],
    ['·', '-'],
    ['/', '-'],
    ['_', '-'],
    [',', '-'],
    [':', ';'],
  ]

  for (let i = 0; i < charMappings.length; i++) {
    const regex = new RegExp(charMappings[i][0], 'g')
    str = str.replace(regex, charMappings[i][1])
  }

  str = str
    .replace(/[^\p{L}\d\s]/gu, '')
    // .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
  // .replace(/-+/g, '-') // collapse dashes

  return str
}

export const removeNullValues = (obj: { [key: string]: any }): { [key: string]: any } => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === null) {
      // skip null values and empty objects
      return acc
    }

    return { ...acc, [key]: value }
  }, {})
}

export const replaceWithNull = (obj: { [key: string]: any }): { [key: string]: any } => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === '') {
      // skip null values and empty objects
      return { ...acc, [key]: null }
    }

    return { ...acc, [key]: value }
  }, {})
}
