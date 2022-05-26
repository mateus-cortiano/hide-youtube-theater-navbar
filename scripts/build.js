/* export.js */

const fs = require('fs')

let buffer = '<!-- hide youtube theater nav bar -->\r\n\r\n'

fs.readFile('./src/script.js', 'utf8', (err, data) => {
  if (err) throw err

  buffer += '<script>\r\n'

  for (let line of data.split('\r\n')) {
    line = '  ' + line + '\r\n'
    buffer += line
  }

  buffer += '</script>\r\n\r\n\r\n'

  fs.readFile('./src/styles.css', 'utf8', (err, data) => {
    if (err) throw err

    buffer += '<style>\r\n'

    for (let line of data.split('\r\n')) {
      line = '  ' + line + '\r\n'
      buffer += line
    }

    buffer += '</style>\r\n'

    fs.writeFile('./dist/bundle.html', buffer, 'utf8', err => {
      if (err) throw err
    })
  })
})
