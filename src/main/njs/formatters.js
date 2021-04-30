import { add, isWithinInterval, sub } from 'date-fns'
import { isMobile as _isMobile } from 'is-mobile'
// import { nanoid } from 'nanoid'
import platform from 'platform'
import { LogLevel } from '@qiwi/substrate'

const isMobile = (ua) =>
  _isMobile({ ua, tablet: true })

const getDeviceInfo = (userAgent) => {
  const parsedData = userAgent ? platform.parse(userAgent) : {}
  const { name, version, layout, product, manufacturer, os } = parsedData
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

const isTimestampActual = (timestamp) => {
  const currentDate = new Date()
  return isWithinInterval(new Date(timestamp), {
    start: sub(currentDate, { days: 7 }),
    end: add(currentDate, { minutes: 10 }),
  })
}

export function formatEvent(event, origin) {
  const timestamp = isTimestampActual(event.timestamp) && event.timestamp
  event.meta.deviceInfo = event.meta.deviceInfo
    ? event.meta.deviceInfo
    : getDeviceInfo(event.meta.userAgent)

  const meta = {
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
  // const batchId = nanoid()
  const batchSize = event.events.length

  return event.events.map((evt, index) =>
    formatEvent(evt, {
      // TODO: add real batchId
      batch: { pos: index, id: 42, size: batchSize },
      host,
      ip,
    }),
  )
}

