export enum ModelSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type CodeItem = {
  __typename: 'CodeItem'
  tableCode: string
  itemCode: string
  isEditable: boolean
  isActive: boolean
  name?: string | null
  compareUnit?: string | null
  compareUnitValue?: number | null
  createdAt: string
  updatedAt: string
}

export type GetCodeItemQueryVariables = {
  tableCode: string
  itemCode: string
}

export type GetCodeItemQuery = {
  getCodeItem?: {
    __typename: 'CodeItem'
    tableCode: string
    itemCode: string
    isEditable: boolean
    isActive: boolean
    name?: string | null
    compareUnit?: string | null
    compareUnitValue?: number | null
    createdAt: string
    updatedAt: string
  } | null
}
