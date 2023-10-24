import { appState } from '@/state'
import { AppSyncHelper, generateUUID } from '@/utils'

const { sessionId } = appState

export const handleError = async (error: any, functionName: string, errorLogOptions?: any) => {
  if (!error) return { status: 400, error: 'An unknown error occurred', data: {} }

  let errorMessage = ''
  switch (true) {
    case Boolean(error.errors):
      // Handles graphql errors
      errorMessage = error.errors.map((error: any) => error.message).join('.\n ')
      break
    case Boolean(error.message):
      // Handles errors with a message
      errorMessage = error.message
      break

    default:
      errorMessage = error || 'An unknown error occurred'
  }

  const logMessage = `Error in ${functionName}: ${errorMessage}`

  try {
    // process.env.NODE_ENV !== 'development' && (await newErrorLog(logMessage, errorLogOptions))
  } catch (error) {
    console.log(error)
  }

  return { status: 400, error: errorMessage, data: {} }
}

// export const newErrorLog = async (
//   errorMessage: string,
//   errorLogOptions?: Partial<APITypes.CreateErrorLogInput>
// ) => {
//   const variables: APITypes.CreateErrorLogMutationVariables = {
//     input: {
//       sessionId: sessionId.get() || generateUUID(),
//       logId: generateUUID(),
//       message: errorMessage,
//       logType: APITypes.ErrorLogType.ADMIN,
//       severity: APITypes.ErrorSeverity.WARN,
//       ...errorLogOptions,
//     },
//   }

//   const { data } = await AppSyncHelper(Mutations.createErrorLog, variables)

//   return data
// }
