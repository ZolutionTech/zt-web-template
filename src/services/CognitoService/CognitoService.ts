import { Auth } from 'aws-amplify'
import { AppSyncHelper, logDev, APIResponse } from '@/utils'
import { APITypes, Mutations, Queries } from '@/graphql'
import { appState } from '@/state'
import { handleError } from '..'

const { isAuthenticated } = appState

export const CognitoService = {
  async signIn(input: { email: string; password: string }): Promise<APIResponse> {
    try {
      const data = await Auth.signIn(input.email, input.password)

      if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
        return { status: 200, data: 'USER_MIGRATION' }
      }

      return { status: 200, data }
    } catch (error: any) {
      if (error.code === 'UserNotFoundException') {
        const { status } = await this.handleUserMigration(input.email)

        if (status === 200) {
          // Continue to change password
          return { status: 200, data: 'USER_MIGRATION' }
        }
      }

      return handleError(error, 'signIn')
    }
  },

  async handleUserMigration(email: string): Promise<APIResponse> {
    try {
      const params = {
        email,
      }

      const { data } = (await AppSyncHelper(Mutations.migrateUser, params)) as {
        data: APITypes.MigrateUserMutation
        errors: any[]
      }

      return { status: 200, data: data.migrateUser }
    } catch (error) {
      return handleError(error, 'handleUserMigration')
    }
  },
  async signOut(): Promise<APIResponse> {
    try {
      await Auth.signOut()
      isAuthenticated.set(false)

      return { status: 200 }
    } catch (error) {
      return handleError(error, 'signOut')
    }
  },

  async confirmSignUp(input: { email: string; code: string }): Promise<APIResponse> {
    try {
      await Auth.confirmSignUp(input.email, input.code)
      return { status: 200 }
    } catch (error: any) {
      return handleError(error, 'confirmSignUp')
    }
  },

  async resendConfirmationCode(email: string): Promise<APIResponse> {
    try {
      await Auth.resendSignUp(email)
      return { status: 200 }
    } catch (error: any) {
      return handleError(error, 'resendConfirmationCode')
    }
  },

  async forgotPassword(email: string): Promise<APIResponse> {
    try {
      await Auth.forgotPassword(email)
      return { status: 200 }
    } catch (error: any) {
      return handleError(error, 'forgotPassword')
    }
  },

  async confirmForgotPassword(input: {
    email: string
    code: string
    password: string
  }): Promise<APIResponse> {
    try {
      await Auth.forgotPasswordSubmit(input.email, input.code, input.password)
      return { status: 200 }
    } catch (error: any) {
      return handleError(error, 'confirmForgotPassword')
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<APIResponse> {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const data = await Auth.changePassword(user, oldPassword, newPassword)

      console.log(data)
      return {
        status: 200,
        data,
      }
    } catch (error) {
      return handleError(error, 'changePassword')
    }
  },

  async completeNewPassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<APIResponse> {
    try {
      const user = await Auth.signIn(username, oldPassword)

      const loggedInUser = await Auth.completeNewPassword(user, newPassword)

      return {
        status: 200,
        data: loggedInUser,
      }
    } catch (error) {
      return handleError(error, 'completeNewPassword')
    }
  },
}
