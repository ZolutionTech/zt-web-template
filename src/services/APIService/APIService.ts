import { Mutations, Queries } from '@/graphql'
import { appState } from '@/state'
import { APIResponse, AppSyncHelper, logDev } from '@/utils'
import { Auth, Storage } from 'aws-amplify'
import { handleError } from '..'
import { APIQueryInput, APIMutationInput } from './types'

const { isAuthenticated } = appState

export const APIService = {
  async get(input: APIQueryInput): Promise<APIResponse> {
    const { variables, query, authMode, setState, errorLogOptions } = input
    try {
      const { data } = await AppSyncHelper(Queries[query], variables, authMode)

      const item = data[query]

      setState && setState(item)

      return { status: 200, data: item }
    } catch (error) {
      return await handleError(error, query, errorLogOptions)
    }
  },

  async list(input: APIQueryInput, isMounted?: () => boolean): Promise<APIResponse> {
    let { variables, query, authMode, setState, errorLogOptions, settings } = input

    try {
      authMode ||= (await Auth.currentAuthenticatedUser()) && 'AMAZON_COGNITO_USER_POOLS'
    } catch (error) {
      authMode ||= 'AWS_IAM'
    }

    logDev(query, ': authMode: ', authMode)

    try {
      const { data } = await AppSyncHelper(Queries[query], variables, authMode, '', settings)

      const { items } = data[query]

      if (isMounted && !isMounted()) return { status: 200, data: [] }

      setState && setState(items)

      return { status: 200, data: items || [], nextToken: data[query].nextToken }
    } catch (error) {
      return await handleError(error, query, errorLogOptions)
    }
  },

  async mutation(input: APIMutationInput): Promise<APIResponse> {
    const { variables, mutation, authMode, setState, isAsync, errorLogOptions } = input
    try {
      let params = await handleFiles(variables)
      params = removeTypenameKeys(params)

      if (isAsync) {
        // TODO: Add subscriptions
        AppSyncHelper(Mutations[mutation], params, authMode)

        return { status: 200, data: null }
      }

      const { data } = await AppSyncHelper(Mutations[mutation], params, authMode)

      const item = data[mutation]

      logDev(`${mutation} data: `, item)

      setState && setState(item)

      return { status: 200, data: item }
    } catch (error) {
      logDev('Input:', input.variables)
      return await handleError(error, mutation, errorLogOptions)
    }
  },
}

const handleFiles = async (variables: any) => {
  if (Boolean(variables.input)) {
    const input = await handleFileUploads(variables.input)
    return {
      input: {
        ...variables.input,
        ...input,
      },
    }
  } else {
    const input = await handleFileUploads(variables)
    return {
      ...variables,
      ...input,
    }
  }
}

export const handleFileUploads = async (input: any) => {
  // Check if there are any files to upload of the type

  const filesToUpload = Object.entries(input).filter(([key, value]) => value instanceof File)

  const s3Keys = await Promise.all(
    filesToUpload.map(([key, value]) => {
      let file: File = value as any

      return Storage.put(`${file.name}`, file, {
        contentType: file.type,
        acl: 'public-read',
      })
    })
  )

  const urls = await Promise.all(s3Keys.map((key) => Storage.get(key.key)))

  const uploadParams = urls.reduce((acc: { [key: string]: string }, url, index) => {
    acc[filesToUpload[index][0]] = url.split('?')[0]
    return acc
  }, {})

  const listOfObjectsParams = await handleListOfObjectsFileUpload(input)

  return { ...uploadParams, ...listOfObjectsParams }
}

const handleListOfObjectsFileUpload = async (input: any) => {
  const checkListExistance = Object.entries(input).filter(([key, val]) => Array.isArray(val))

  if (!checkListExistance[0]) return {}

  // Check if there are any files to upload inside each object of the array
  const filesToUpload: { parentKey: string; parentIndex: number; media: File; key: string }[] = []

  checkListExistance.forEach(([parentKey, val]) => {
    const list = val as any[]

    list.forEach((item, index) => {
      const hasFile = Object.entries(item).forEach(([key, val]) => {
        if (val instanceof File) {
          filesToUpload.push({ parentKey, parentIndex: index, media: val, key })
        }
      })
    })
  })

  if (!filesToUpload[0]) return {}

  // Loop through filesToUpload and upload them to S3
  // Then get the S3 urls
  // Then update the input object with the urls

  const s3Keys = await Promise.all(
    filesToUpload.map(({ media }) => {
      return Storage.put(`${input.ClientId}/assets/${media.name}`, media, {
        contentType: media.type,
        acl: 'public-read',
      })
    })
  )

  const urls = await Promise.all(s3Keys.map((key) => Storage.get(key.key)))

  const uploadParams = urls.reduce((acc: { [key: string]: any }, url, index) => {
    const { parentKey, parentIndex, key } = filesToUpload[index]

    const list = (input as any)[parentKey] as any[] // Sorry, mom
    const item = list[parentIndex]

    item[key] = url.split('?')[0]

    acc[parentKey] = list

    return acc
  }, {})

  return uploadParams
}

const removeTypenameKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    // If obj is an array, recursively call the function on each element.
    return obj.map(removeTypenameKeys)
  } else if (typeof obj === 'object' && obj !== null) {
    // If obj is an object, create a new object without the "__typename" keys.
    const newObj: { [key: string]: any } = {}
    for (const key in obj) {
      if (key !== '__typename') {
        newObj[key] = removeTypenameKeys(obj[key])
      }
    }
    return newObj
  } else {
    // If obj is not an array or object, return it as is.
    return obj
  }
}
