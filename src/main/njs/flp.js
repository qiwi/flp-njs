import { formatEventBatch, formatEvent } from './formatters'

const getHostAndIp = (request) => ({
  ip:
    request.headersIn['X-Forwarded-For'] ||
    request.remoteAddress,
  host: request.headersIn.host,
})

function logBatch (r) {
  try {
    const parsedBody = JSON.parse(r.requestBody)
    const formattedEntries = formatEventBatch(parsedBody, getHostAndIp(r))
    formattedEntries.forEach(entry => {
      r.log('\n' + JSON.stringify(entry))
    })
  } catch (e) {
    r.error(e)
  }
  r.return(200, 'roger that')
}

function log(r) {
  try {
    const parsedBody = JSON.parse(r.requestBody)
    const formattedEvent = formatEvent(parsedBody, getHostAndIp(r))
    r.log('\n' + JSON.stringify(formattedEvent))
  } catch (e) {
    r.error(e)
  }
  r.return(200, 'roger that')
}

export default { log, logBatch }
