/* js */

const POLLING_INTERVAL = 1500
const SHOULD_TRANSITION = 'should_transition'
const THEATER = 'theater'
const WATCH_ELEMENT = 'ytd-watch-flexy'
const MASTHEAD = '#masthead-container'
const PAGE_MANAGER_CLASS = 'ytd-page-manager'
const URL_REGEX_PATTERN = /https?:\/\/www.youtube.com($|\/$|\/\?.*$)/

const body = $(document.body)
const page_manager = $(PAGE_MANAGER_CLASS)
const masthead = $(MASTHEAD)
const pattern = new RegExp(URL_REGEX_PATTERN)

let interval_id = undefined
let current_url = window.location.href
let is_active = pattern.test(current_url) ? false : true

// ---

async function wait_for(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function wait_for_condition(condition, max_retries = 7, time_mult = 50) {
  async function retry(retries = 0) {
    if (condition()) return Promise.resolve()

    if (retries > max_retries)
      return Promise.reject(`Max retries reached for ${condition}`)

    await wait_for(2 ** retries * time_mult)

    return retry(retries + 1)
  }

  return retry()
}

function add_class(class_name, ...elements) {
  for (let element of elements) element.addClass(class_name)
}

function remove_class(class_name, ...elements) {
  for (let element of elements) element.removeClass(class_name)
}

function update_elements() {
  if (!is_active) return

  Promise.resolve(
    wait_for_condition(() => ($(WATCH_ELEMENT).length === 0 ? false : true))
  ).then(() => {
    let target = $(WATCH_ELEMENT)
    let istheater = target.attr(THEATER) === undefined ? false : true

    if (!istheater) {
      remove_class(THEATER, masthead, page_manager)
      return
    }

    add_class(THEATER, masthead, page_manager)
  })
}

function check_url() {
  current_url = window.location.href

  if (pattern.test(current_url)) {
    if (is_active) {
      is_active = false
      remove_class(THEATER, masthead, page_manager)
      remove_class(SHOULD_TRANSITION, masthead, page_manager)

      if (interval_id !== undefined) {
        interval_id = undefined
        clearInterval(interval_id)
      }
    }

    return
  }

  if (is_active && !(interval_id === undefined)) return

  is_active = true
  interval_id = setInterval(update_elements, POLLING_INTERVAL)
  add_class(SHOULD_TRANSITION, masthead, page_manager)
}

// --

setInterval(check_url, POLLING_INTERVAL)
