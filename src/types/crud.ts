export type Id = string | number

export type CrudMode = 'create' | 'edit' | 'view'

export interface PageQuery {
  page: number
  pageSize: number
  [key: string]: any
}

// Correction: In ProjectListExample.vue, it used `size`. I should check consistency.
// User explicitly asked for: PageQuery { page: number; pageSize: number }
// I will use pageSize as requested.

export interface PageResult<T> {
  list: T[]
  total: number
}
