require('../utils')()

const update = (table, listField, listValue, condition) => {
  if (!table || listField.length !== listValue.length)
    throw 'not correct format'

  let updateItem = []

  for (let index = 0; index < listField.length; index++) {
    const field = listField[index]
    const value = listValue[index]
    const formatItem = typeof value === 'string' ? "{0}='{1}'" : '{0}={1}'
    updateItem.push(formatString(formatItem, field, value))
  }

  let query = formatString(
    'UPDATE {0} SET {1}{2}',
    table,
    updateItem.join(', '),
    condition ? ' WHERE ' + condition : ''
  )

  console.log('db update query: ' + query)

  return query
}

module.exports = {
  update
}
