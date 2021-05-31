import flp from '../../main/njs/flp'
import eventBody from '../resources/event.json'

const { getHostAndIp, log, logBatch } = flp

const loggedEvent = '\n{"meta":{"event":{"message":"string1","tags":["string"],"code":"string","level":"error","meta":{"appName":"string","appHost":"string","appVersion":"string","appNamespace":"string","appConfig":{},"deviceInfo":{},"userAgent":"string","envProfile":"ci","timestamp":"string"},"details":{}},"origin":{"ip":"127.0.0.1","host":"localhost:8080"}},"input":["string1"],"level":"error"}'

describe('getHostAndIp', () => {
  it('return X-Forwarded-For as ip and host', () => {
    expect(getHostAndIp({
      headersIn: {
        'X-Forwarded-For': '127.0.0.1',
        host: 'host'
      }
    })).toEqual({
      ip: '127.0.0.1',
      host: 'host'
    })
  })

  it('return remoteAddress as ip and host', () => {
    expect(getHostAndIp({
      remoteAddress: '127.0.0.1',
      headersIn: {
        host: 'host'
      }
    })).toEqual({
      ip: '127.0.0.1',
      host: 'host'
    })
  })
})

describe('log', () => {
  it('formats & logs event', () => {
    const r = {
      log: jest.fn(),
      requestBody: JSON.stringify(eventBody),
      return: jest.fn(),
      headersIn: {
        'X-Forwarded-For': '127.0.0.1',
        host: 'localhost:8080'
      }
    }
    log(r)
    expect(r.log).toHaveBeenCalledWith(loggedEvent)
    expect(r.return).toHaveBeenCalledWith(200, 'roger that')
  })

  it('log an error and returns 400', () => {
    const r = {
      error: jest.fn(),
      requestBody: 'foo',
      return: jest.fn(),
      headersIn: {
        'X-Forwarded-For': '127.0.0.1',
        host: 'localhost:8080'
      }
    }
    log(r)
    expect(r.error).toHaveBeenCalledWith(expect.any(Error))
    expect(r.return).toHaveBeenCalledWith(400, expect.stringMatching(/^Event parsing error: /))
  })
})

describe('logBatch', () => {
  it('formats & logs events', () => {
    const r = {
      log: jest.fn(),
      requestBody: JSON.stringify({ events: new Array(3).fill(eventBody) }),
      return: jest.fn(),
      headersIn: {
        'X-Forwarded-For': '127.0.0.1',
        host: 'localhost:8080'
      }
    }
    logBatch(r)
    expect(r.log).toHaveBeenCalledTimes(3)
    expect(r.return).toHaveBeenCalledWith(200, 'roger that')
  })

  it('log an error and returns 400', () => {
    const r = {
      error: jest.fn(),
      requestBody: 'foo',
      return: jest.fn(),
      headersIn: {
        'X-Forwarded-For': '127.0.0.1',
        host: 'localhost:8080'
      }
    }
    logBatch(r)
    expect(r.error).toHaveBeenCalledWith(expect.any(Error))
    expect(r.return).toHaveBeenCalledWith(400, expect.stringMatching(/^Event parsing error: /))
  })
})
