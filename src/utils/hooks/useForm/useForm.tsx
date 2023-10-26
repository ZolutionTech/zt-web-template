import { FormFieldMetaType } from '@/components'
import { isNotEmpty, useForm as useMantineForm } from '@mantine/form'
import { useCallback } from 'react'

type Props = {
  fields: FormFieldMetaType[]
  initialValues?: { [key: string]: any }
}

export const useForm = ({ fields, initialValues }: Props) => {
  const generateInitialValues = useCallback(() => {
    const values: { [key: string]: any } = {}

    fields.forEach((field) => {
      // field.key might be nested like 'Theme.ColorMode'
      // so we need to split it and then iterate over the keys

      const keys = field.key.split('.')

      if (keys.length === 1) {
        values[field.key] = initialValues?.[field.key] ?? field.defaultValue ?? ''
        return
      }

      // [0] = Theme, [1] = ColorMode
      keys.forEach((key, index) => {
        if (index === 0) {
          values[key] = values[key] || {}
        } else {
          values[keys[index - 1]][key] =
            initialValues?.[keys[index - 1]]?.[key] ?? field.defaultValue ?? ''
        }
      })
    })
    return values
  }, [initialValues])

  const generateValidationRules = () => {
    const validationRules: { [key: string]: (value: any, values: any) => any } = {}

    fields.forEach((field) => {
      if (field.optional || field.type === 'custom') return

      validationRules[field.key] = (value: any, values: any) => {
        if (field.validation) {
          return field.validation(value, values)
        }

        if (typeof field.defaultValue === 'boolean') {
          if (typeof value !== 'boolean') {
            return 'Please fill out this field.'
          } else {
            return null
          }
        }

        const isEmptyError = isNotEmpty('Please fill out this field.')(value)
        if (isEmptyError) {
          return isEmptyError
        }
      }
    })

    return validationRules
  }

  const form = useMantineForm({
    initialValues: generateInitialValues(),
    validate: generateValidationRules(),
  })

  const reinitializeForm = useCallback(
    (values?: any, specificValues?: any) => {
      if (!values) {
        if (specificValues) {
          form.setValues(specificValues)
        } else {
          form.setValues(generateInitialValues())
        }

        form.resetDirty()
        return
      }

      const valuesToSet = Object.fromEntries(
        Object.entries(values).filter(([key]) => fields.some((field) => field.key === key))
      )

      form.setValues({ ...valuesToSet, ...(specificValues || {}) })
      form.resetDirty()
    },
    [form]
  )

  return {
    form,

    reinitializeForm,
  }
}
