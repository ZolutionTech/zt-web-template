import { ImmutableArray, ImmutableObject, State } from '@hookstate/core'

export const generateUUID = () => {
  // Generate uniqe key
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
}

export const logDev = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...optionalParams)
  }
}

export const getInitials = (name: string): string => {
  let initials = ''
  const words = name.split(' ') // Split the name into individual words
  for (const word of words) {
    initials += word[0].toUpperCase() // Add the first character of each word (converted to uppercase)
  }
  return initials
}

export const parseState = <T>(state: T | ImmutableObject<T> | ImmutableArray<T> | null): T => {
  return state ? JSON.parse(JSON.stringify(state)) : state
}

export const base64ToBlob = (base64Data: string, contentType: string) => {
  const byteCharacters = Buffer.from(base64Data, 'base64').toString('binary')
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}
