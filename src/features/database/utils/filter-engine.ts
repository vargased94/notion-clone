import type {
  ViewFilter,
  EntryValue,
  DatabaseProperty,
  DatabaseEntry,
  FilterOperator,
} from '../types/database.types'

type ValueGetter = (entryId: string, propertyId: string) => EntryValue | undefined

function getComparableValue(
  value: EntryValue | undefined,
  property: DatabaseProperty,
): string | number | boolean | null {
  if (!value) return null

  switch (property.type) {
    case 'title':
    case 'text':
    case 'url':
    case 'email':
    case 'phone':
      return value.value_text ?? null
    case 'number':
      return value.value_number ?? null
    case 'checkbox':
      return value.value_boolean ?? false
    case 'date':
    case 'created_time':
    case 'last_edited_time':
      return value.value_date ?? null
    case 'select':
    case 'status':
      return value.value_text ?? null
    case 'multi_select':
    case 'person':
    case 'files':
      return JSON.stringify(value.value_json ?? [])
    default:
      return value.value_text ?? null
  }
}

function matchesFilter(
  val: string | number | boolean | null,
  operator: FilterOperator,
  filterValue: unknown,
): boolean {
  switch (operator) {
    case 'equals':
      return val === filterValue
    case 'does_not_equal':
      return val !== filterValue
    case 'contains':
      return typeof val === 'string' && typeof filterValue === 'string'
        && val.toLowerCase().includes(filterValue.toLowerCase())
    case 'does_not_contain':
      return typeof val === 'string' && typeof filterValue === 'string'
        && !val.toLowerCase().includes(filterValue.toLowerCase())
    case 'starts_with':
      return typeof val === 'string' && typeof filterValue === 'string'
        && val.toLowerCase().startsWith(filterValue.toLowerCase())
    case 'ends_with':
      return typeof val === 'string' && typeof filterValue === 'string'
        && val.toLowerCase().endsWith(filterValue.toLowerCase())
    case 'is_empty':
      return val === null || val === '' || val === false
    case 'is_not_empty':
      return val !== null && val !== '' && val !== false
    case 'greater_than':
      return typeof val === 'number' && typeof filterValue === 'number' && val > filterValue
    case 'less_than':
      return typeof val === 'number' && typeof filterValue === 'number' && val < filterValue
    case 'greater_than_or_equal':
      return typeof val === 'number' && typeof filterValue === 'number' && val >= filterValue
    case 'less_than_or_equal':
      return typeof val === 'number' && typeof filterValue === 'number' && val <= filterValue
    case 'is_before':
      return typeof val === 'string' && typeof filterValue === 'string' && val < filterValue
    case 'is_after':
      return typeof val === 'string' && typeof filterValue === 'string' && val > filterValue
    case 'is_on_or_before':
      return typeof val === 'string' && typeof filterValue === 'string' && val <= filterValue
    case 'is_on_or_after':
      return typeof val === 'string' && typeof filterValue === 'string' && val >= filterValue
    case 'is_checked':
      return val === true
    case 'is_not_checked':
      return val !== true
    default:
      return true
  }
}

export function applyFilters(
  entries: DatabaseEntry[],
  filters: ViewFilter[],
  properties: DatabaseProperty[],
  getValue: ValueGetter,
): DatabaseEntry[] {
  if (filters.length === 0) return entries

  const propsMap = new Map(properties.map((p) => [p.id, p]))

  return entries.filter((entry) => {
    // Group filters by logical operator (simplified: top-level AND)
    return filters.every((filter) => {
      if (filter.is_group || !filter.property_id || !filter.operator) return true

      const property = propsMap.get(filter.property_id)
      if (!property) return true

      const entryValue = getValue(entry.id, filter.property_id)
      const comparable = getComparableValue(entryValue, property)

      return matchesFilter(comparable, filter.operator as FilterOperator, filter.value)
    })
  })
}
