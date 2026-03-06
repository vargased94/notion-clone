import type {
  ViewSort,
  EntryValue,
  DatabaseProperty,
  DatabaseEntry,
} from '../types/database.types'

type ValueGetter = (entryId: string, propertyId: string) => EntryValue | undefined

function getSortValue(
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
    case 'select':
    case 'status':
      return value.value_text?.toLowerCase() ?? null
    case 'number':
      return value.value_number ?? null
    case 'checkbox':
      return value.value_boolean ?? false
    case 'date':
    case 'created_time':
    case 'last_edited_time':
      return value.value_date ?? null
    default:
      return value.value_text ?? null
  }
}

function compareValues(
  a: string | number | boolean | null,
  b: string | number | boolean | null,
): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : a ? -1 : 1
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a).localeCompare(String(b))
}

export function applySorts(
  entries: DatabaseEntry[],
  sorts: ViewSort[],
  properties: DatabaseProperty[],
  getValue: ValueGetter,
): DatabaseEntry[] {
  if (sorts.length === 0) return entries

  const propsMap = new Map(properties.map((p) => [p.id, p]))
  const sorted = [...entries]

  sorted.sort((a, b) => {
    for (const sort of sorts) {
      const property = propsMap.get(sort.property_id)
      if (!property) continue

      const aVal = getSortValue(getValue(a.id, sort.property_id), property)
      const bVal = getSortValue(getValue(b.id, sort.property_id), property)

      const cmp = compareValues(aVal, bVal)
      if (cmp !== 0) {
        return sort.direction === 'descending' ? -cmp : cmp
      }
    }
    return a.position - b.position
  })

  return sorted
}
