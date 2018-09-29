require('../utils')()

const update = (table, value, condition) => {
  if (!table || !value) throw 'not correct format'

  let query = formatString(
    'UPDATE {0} SET {1}{2}',
    table,
    value,
    condition ? ' WHERE ' + condition : ''
  )

  console.log('db update query: ' + query)

  return query
}

const select = (field, table, condition) => {
  if (!field || !table) throw 'not correct format'

  let query = formatString(
    'SELECT {0} FROM {1}{2}',
    field,
    table,
    condition ? ' WHERE ' + condition : ''
  )

  console.log('db select query: ' + query)

  return query
}

const innerJoin = (table1, table2, condition) => {
  if (!table1 || !table2 || !condition) throw 'not correct format'

  let table = formatString(
    '{0} INNER JOIN {1} ON {2}',
    table1,
    table2,
    condition
  )

  return table
}

const joinFieldValue = (listField, listValue, separate = ', ') => {
  let updateItem = []

  for (let index = 0; index < listField.length; index++) {
    const field = listField[index]
    const value = listValue[index]
    const formatItem = typeof value === 'string' ? "{0}='{1}'" : '{0}={1}'
    updateItem.push(formatString(formatItem, field, value))
  }

  return updateItem.join(separate)
}

module.exports = {
  update,
  select,
  innerJoin,
  joinFieldValue
}
