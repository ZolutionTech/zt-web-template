import React, { useMemo } from 'react'
import { FormFieldProps } from '..'
import { TextInput } from '@mantine/core'

export const FormField = ({ form, field }: FormFieldProps) => {
  const dependencies = [
    getNestedProperty(form.values, field.key),
    field.props,
    form.errors[field.key],
    ...(field.dependencies?.map((dependentKey) => form.values[dependentKey]) || []),
  ]

  return useMemo(() => {
    switch (field.type) {
      case 'custom':
        return field.component ? <field.component form={form} {...field} {...field.props} /> : null

      default:
        return <TextInput label={field.label} {...form.getInputProps(field.key)} {...field.props} />
    }
  }, dependencies)
}

const getNestedProperty = (obj: any, keyString: string): any => {
  const keys = keyString.split('.')
  let nestedObj = obj

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    nestedObj = nestedObj[key]
    if (!nestedObj) {
      return undefined
    }
  }

  return nestedObj
}
