import { add, isWithinInterval, sub } from 'date-fns'
import { isMobile as _isMobile } from 'is-mobile'
// import { nanoid } from 'nanoid'
import platform from 'platform'

var isMobile = (ua) =>
  _isMobile({ ua, tablet: true })

var getDeviceInfo = (userAgent) => {
  var parsedData = userAgent ? platform.parse(userAgent) : {}
  var { name, version, layout, product, manufacturer, os } = parsedData
  return {
    browser: {
      name,
      version,
      layout,
    },
    isMobile: isMobile(userAgent || window.navigator.userAgent),
    model: {
      name: product,
      manufacturer,
    },
    os,
  }
}

var isTimestampActual = (timestamp) => {
  var currentDate = new Date()
  return isWithinInterval(new Date(timestamp), {
    start: sub(currentDate, { days: 7 }),
    end: add(currentDate, { minutes: 10 }),
  })
}

export function formatEvent(event, origin) {
  var timestamp = isTimestampActual(event.timestamp) && event.timestamp
  event.meta.deviceInfo = event.meta.deviceInfo
    ? event.meta.deviceInfo
    : getDeviceInfo(event.meta.userAgent)

  var meta = {
    event,
    origin,
    timestamp,
  }
  return {
    meta,
    input: [event.message],
    level: event.level || LogLevel.INFO,
  }
}

export function formatEventBatch(event, { host, ip }) {
  // var batchId = nanoid()
  var batchSize = event.events.length

  return event.events.map((evt, index) =>
    formatEvent(evt, {
      // TODO: add real batchId
      batch: { pos: index, id: 42, size: batchSize },
      host,
      ip,
    }),
  )
}

