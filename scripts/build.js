/* build.js */

const fs = require('fs')

// ---

const TITLE = 'hide youtube theater navbar'
const OUTPUT_FILE = './dist/bundle.html'

// ---

let buffer = `<!-- ${TITLE} -->\r\n\r\n`

fs.readFile('./src/script.js', 'utf8', (err, data) => {
  if (err) throw err

  buffer += '<script>\r\n'

  for (let line of data.split('\r\n')) buffer += '  ' + line + '\r\n'

  buffer += '</script>\r\n\r\n\r\n'
})

fs.readFile('./src/styles.css', 'utf8', (err, data) => {
  if (err) throw err

  buffer += '<style>\r\n'

  for (let line of data.split('\r\n')) buffer += '  ' + line + '\r\n'

  buffer += '</style>\r\n'
})

fs.readFile(OUTPUT_FILE, 'utf8', err => {
  if (err) throw err

  fs.writeFile(OUTPUT_FILE, buffer, 'utf8', err => {
    if (err) throw err
  })
})
